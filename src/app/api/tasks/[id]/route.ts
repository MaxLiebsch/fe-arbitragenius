import { PRODUCT_COL, TASK_COL, WHOLESALE_COL } from "@/constant/constant";
import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    .findOne({
      userId: user.$id,
      _id: new ObjectId(params.id),
    });

  if (res) {
    return new Response(JSON.stringify(res), {
      status: 200,
    });
  } else {
    return new Response(JSON.stringify([]), {
      status: 404,
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getLoggedInUser();

  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const target = request.nextUrl.searchParams.get("target");

  const mongo = await clientPool["NEXT_MONGO_CRAWLER_DATA_ADMIN"];

  const taskCollection = mongo
    .db(process.env.NEXT_MONGO_CRAWLER_DATA ?? "")
    .collection(TASK_COL);

  const productCol = mongo
    .db(process.env.NEXT_MONGO_DB ?? "")
    .collection(PRODUCT_COL);

  const taskFinished = await taskCollection.findOne({
    _id: new ObjectId(params.id),
    "process.pending": { $eq: 0 },
  });

  if (taskFinished !== null) {
    return new Response(
      "Analyse kann nicht gelöscht werden, da sie noch in Bearbeitung ist",
      {
        status: 400,
      }
    );
  }

  if (params.id) {
    const deleteProducts = await productCol.deleteMany({
      taskIds: params.id,
    });

    if (!deleteProducts.acknowledged) {
      return new Response(
        "Produkte aus Analyse konnten nicht gelöscht werden",
        {
          status: 500,
        }
      );
    }
  }

  const task = await taskCollection.deleteOne({ _id: new ObjectId(params.id) });

  if (!task.acknowledged) {
    return new Response("Analyse konnte nicht gelöscht werden", {
      status: 500,
    });
  }

  return new Response("Analyse gelöscht", {
    status: 200,
  });
}
