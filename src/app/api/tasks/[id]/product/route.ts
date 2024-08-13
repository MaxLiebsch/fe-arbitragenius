import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import { SortDirection } from "mongodb";
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
  const searchParams = request.nextUrl.searchParams;
  const query = {
    page: Number(searchParams.get("page")) || 0,
    size: Number(searchParams.get("size")) || 10,
    field: searchParams.get("sortby"),
    order: searchParams.get("sortorder"),
  };

  if (query.page < 0)
    return new Response("page must be at least 0", {
      status: 400,
    });

  if (query.size < 1)
    return new Response("size must be at least 1", {
      status: 400,
    });
  const aggregation = [];

  const mongo = await clientPool["NEXT_MONGO_CRAWLER_DATA_ADMIN"];
  const wholsaleCollection = mongo
    .db(process.env.NEXT_MONOGO_CRAWLER_DATA ?? "")
    .collection(process.env.NEXT_MONGO_WHOLESALE ?? "wholesale");

  const sort: {
    [key: string]: SortDirection;
  } = {};

  sort["status"] = 1;

  if (query.field === "none") {
    sort["a_mrgn_pct"] = -1;
  } else if (query.field) {
    sort[query.field] = query.order === "asc" ? 1 : -1;
  }

  aggregation.push(
    {
      $match: {
        taskId: params.id,
      },
    },
    {
      $sort: sort,
    },
    {
      $skip: query.page * query.size,
    },
    {
      $limit: query.size,
    }
  );

  const res = await wholsaleCollection.aggregate(aggregation).toArray();

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
