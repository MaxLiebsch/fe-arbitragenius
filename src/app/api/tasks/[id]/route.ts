import { getLoggedInUser } from "@/server/appwrite";
import { mongoAdminPromise } from "@/server/mongo";
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

  const mongo = await mongoAdminPromise;

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

  const mongo = await mongoAdminPromise;

  const taskCollection = mongo
    .db(process.env.NEXT_MONGO_CRAWLER_DATA ?? "")
    .collection(process.env.NEXT_MONGO_TASKS ?? "wholesale");
  const wholesaleCollection = mongo
    .db(process.env.NEXT_MONGO_CRAWLER_DATA ?? "")
    .collection(process.env.NEXT_MONGO_WHOLESALE ?? "wholesale");

  const taskFinished = await taskCollection.findOne({
    _id: new ObjectId(params.id),
    "process.pending": { $eq: 0 },
  });

  console.log('taskFinished:', taskFinished)
  if (taskFinished !== null) {
    return new Response(
      "Analyse kann nicht gelöscht werden, da sie noch in Bearbeitung ist",
      {
        status: 400,
      }
    );
  }

  const deleteProducts = await wholesaleCollection.deleteMany({
    taskId: params.id,
  });

  if (!deleteProducts.acknowledged) {
    return new Response("Produkte aus Analyse konnten nicht gelöscht werden", {
      status: 500,
    });
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
