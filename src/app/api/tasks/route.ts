import { getLoggedInUser } from "@/server/appwrite";
import { mongoAdminPromise, mongoPromise } from "@/server/mongo";
import { Task } from "@/types/tasks";
import { WholeSaleProduct } from "@/types/wholesaleProduct";
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

  const mongo = await mongoAdminPromise;

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

const newTaskBodySchema = z.array(
  z.object({
    ean: z.string(),
    name: z.string().optional(),
    category: z.string().optional(),
    price: z.number(),
    reference: z.string().optional(),
  })
);

// start new task
export async function POST(request: NextRequest) {
  const user = await getLoggedInUser();

  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const mongo = await mongoAdminPromise;
  const taskCollection = mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
    .collection(process.env.NEXT_MONGO_TASKS ?? "");
  const wholsaleCollection = mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA)
    .collection(process.env.NEXT_MONGO_WHOLESALE ?? "");

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

  const body = await request.json();

  const parsedBody = newTaskBodySchema.safeParse(body);

  if (!parsedBody.success) {
    return new Response(JSON.stringify(parsedBody.error.errors), {
      status: 400,
    });
  }

  const newTask: Task = {
    type: "WHOLESALE_SEARCH",
    recurrent: false,
    startedAt: "",
    completedAt: "",
    createdAt: new Date().toISOString(),
    errored: false,
    maintenance: true,
    lastCrawler: [],
    productLimit: body.length <= 500 ? body.length : 500,
    userId: user.$id,
    executing: false,
    progress: {
      pending: body.length,
      total: body.length,
    },
  };

  const taskcreated = await taskCollection.insertOne(newTask);

  if (!taskcreated.acknowledged)
    return new Response("Task konnte nicht erstellt werden", {
      status: 500,
    });

  const productsCreated = await wholsaleCollection.insertMany(
    parsedBody.data.map((item) => {
      const newItem: WholeSaleProduct = {
        ean: item.ean,
        name: item.name ?? "",
        price: item.price,
        reference: item.reference ?? "",
        category: item.category ?? "",
        taskId: taskcreated.insertedId.toHexString(),
        clrName: "",
        locked: false,
        lookup_pending: true,
        shop: "",
        status: "",
        createdAt: new Date().toISOString(),
      };
      return newItem;
    })
  );

  if (!productsCreated.acknowledged)
    return new Response("Wholesale Produkte konnten nicht angelegt werden.", {
      status: 500,
    });

  await taskCollection.updateOne(
    { _id: taskcreated.insertedId },
    {
      $set: { maintenance: false },
    }
  );

  return new Response("Task erstellt.", {
    status: 201,
  });
}
