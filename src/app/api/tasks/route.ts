import { PRODUCT_COL, WHOLESALE_COL } from "@/constant/constant";
import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
import clientPool from "@/server/mongoPool";
import {
  MutateTaskRequest,
  WholeSaleEbyTask,
  WholeSaleTask,
} from "@/types/tasks";
import { WholeSaleProduct } from "@/types/wholesaleProduct";
import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { z } from "zod";

// get my tasks
export async function GET(request: NextRequest) {
  const user = await getLoggedInUser();

  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const mongo = await clientPool["NEXT_MONGO_CRAWLER_DATA_ADMIN"];

  const res = await mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA ?? "")
    .collection(process.env.NEXT_MONGO_TASKS ?? "")
    .find({
      userId: user.$id,
    })
    .toArray();
  if (res.length) {
    return new Response(JSON.stringify(res), {
      status: 200,
    });
  } else {
    return new Response(JSON.stringify([]), {
      status: 404,
    });
  }
}

const newTaskBodySchema = z.object({
  products: z.array(
    z.object({
      ean: z.string(),
      name: z.string().optional(),
      category: z.string().optional(),
      prc: z.number(),
      reference: z.string().optional(),
    })
  ),
  target: z.array(z.string()),
});

// start new task
export async function POST(request: NextRequest) {
  const user = await getLoggedInUser();

  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const mongo = await clientPool["NEXT_MONGO_CRAWLER_DATA_ADMIN"];
  const spotter = await clientPool["NEXT_MONGO_ADMIN"];
  const taskCollection = mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
    .collection(process.env.NEXT_MONGO_TASKS ?? "");

  const productCol = await getProductCol();

  const res = await taskCollection.countDocuments({
    userId: user.$id,
    "progress.pending": { $ne: 0 },
  });

  if (res > 0) {
    return new Response(
      "Upps! Du hast bereits eine laufende Wholesale-Analyse - bitte warte bis diese abgeschlossen ist.",
      {
        status: 400,
      }
    );
  }

  const body = (await request.json()) as MutateTaskRequest;

  const parsedBody = newTaskBodySchema.safeParse(body);

  if (!parsedBody.success) {
    return new Response(JSON.stringify(parsedBody.error.errors), {
      status: 400,
    });
  }
  const taskIds: string[] = [];
  if (body.target.includes("e") && body.target.includes("a")) {
    const wholeSaleTask: WholeSaleTask = {
      type: "WHOLESALE_SEARCH",
      id: "wholesale_search",
      browserConcurrency: process.env.NODE_ENV === "development" ? 3 : 5,
      concurrency: 1,
      recurrent: false,
      startedAt: "",
      name: "",
      completedAt: "",
      createdAt: new Date().toISOString(),
      errored: false,
      maintenance: false,
      lastCrawler: [],
      cooldown: new Date().toISOString(),
      productLimit: body.products.length <= 500 ? body.products.length : 500,
      userId: user.$id,
      executing: false,
      progress: {
        completed: 0,
        pending: body.products.length,
        total: body.products.length,
      },
    };

    const wholeSaleTaskCreated = await taskCollection.insertOne(wholeSaleTask);
    if (!wholeSaleTaskCreated.acknowledged)
      return new Response("Task konnte nicht erstellt werden", {
        status: 500,
      });
    taskIds.push(wholeSaleTaskCreated.insertedId.toString());

    const wholeSaleEbyTask: WholeSaleEbyTask = {
      type: "WHOLESALE_EBY_SEARCH",
      id: "wholesale_eby_search",
      concurrency: 4,
      recurrent: false,
      name: "",
      startedAt: "",
      completedAt: "",
      createdAt: new Date().toISOString(),
      errored: false,
      cooldown: new Date().toISOString(),
      maintenance: false,
      browserConfig: {
        queryEansOnEby: {
          concurrency: 4,
          productLimit: 20,
        },
        lookupCategory: {
          concurrency: 4,
          productLimit: 20,
        },
      },
      lastCrawler: [],
      productLimit: body.products.length <= 500 ? body.products.length : 500,
      userId: user.$id,
      executing: false,
      progress: {
        completed: 0,
        pending: body.products.length,
        total: body.products.length,
      },
    };

    const wholeSaleEbyTaskCreated = await taskCollection.insertOne(
      wholeSaleEbyTask
    );
    if (!wholeSaleTaskCreated.acknowledged)
      return new Response("Task konnte nicht erstellt werden", {
        status: 500,
      });
    taskIds.push(wholeSaleEbyTaskCreated.insertedId.toString());
  } else {
    if (body.target.includes("a")) {
      const newTask: WholeSaleTask = {
        type: "WHOLESALE_SEARCH",
        id: "wholesale_search",
        browserConcurrency: process.env.NODE_ENV === "development" ? 3 : 6,
        concurrency: 1,
        recurrent: false,
        name: "",
        startedAt: "",
        completedAt: "",
        createdAt: new Date().toISOString(),
        errored: false,
        maintenance: true,
        lastCrawler: [],
        productLimit: body.products.length <= 500 ? body.products.length : 500,
        userId: user.$id,
        executing: false,
        cooldown: new Date().toISOString(),
        progress: {
          completed: 0,
          pending: body.products.length,
          total: body.products.length,
        },
      };

      const taskcreated = await taskCollection.insertOne(newTask);
      if (!taskcreated.acknowledged)
        return new Response("Task konnte nicht erstellt werden", {
          status: 500,
        });
      taskIds.push(taskcreated.insertedId.toString());
    }
    if (body.target.includes("e")) {
      const newTask: WholeSaleEbyTask = {
        type: "WHOLESALE_EBY_SEARCH",
        id: "wholesale_eby_search",
        concurrency: 4,
        recurrent: false,
        name: "",
        startedAt: "",
        cooldown: new Date().toISOString(),
        completedAt: "",
        createdAt: new Date().toISOString(),
        errored: false,
        maintenance: true,
        browserConfig: {
          queryEansOnEby: {
            concurrency: 4,
            productLimit: 20,
          },
          lookupCategory: {
            concurrency: 4,
            productLimit: 20,
          },
        },
        lastCrawler: [],
        productLimit: body.products.length <= 500 ? body.products.length : 500,
        userId: user.$id,
        executing: false,
        progress: {
          completed: 0,
          pending: body.products.length,
          total: body.products.length,
        },
      };

      const taskcreated = await taskCollection.insertOne(newTask);
      if (!taskcreated.acknowledged)
        return new Response("Task konnte nicht erstellt werden", {
          status: 500,
        });
      taskIds.push(taskcreated.insertedId.toString());
    }
  }

  const productsCreated = await spotter
    .db()
    .collection(PRODUCT_COL)
    .insertMany(
      parsedBody.data.products.map((item) => {
        const newItem: WholeSaleProduct = {
          ean: item.ean,
          lnk: randomUUID(),
          eanList: [item.ean],
          nm: item.name ?? "",
          s_hash: item.ean,
          sdmn: WHOLESALE_COL,
          target: body.target,
          prc: item.prc,
          qty: 1,
          reference: item.reference ?? "",
          category: item.category ?? "",
          taskIds: taskIds,
          clrName: [],
          shop: "",
          createdAt: new Date().toISOString(),
        };
        body.target.forEach((target) => {
          newItem[`${target}_locked`] = false;
          newItem[`${target}_status`] = "";
          newItem[`${target}_lookup_pending`] = true;
        });
        return newItem;
      })
    );

  if (!productsCreated.acknowledged)
    return new Response("Wholesale Produkte konnten nicht angelegt werden.", {
      status: 500,
    });
  taskIds.forEach(async (taskId) => {
    await taskCollection.updateOne(
      { _id: new ObjectId(taskId) },
      {
        $set: { maintenance: false },
      }
    );
  });

  return new Response("Task erstellt.", {
    status: 201,
  });
}
