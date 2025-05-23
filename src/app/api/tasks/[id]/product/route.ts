import { WHOLESALE_COL } from "@/constant/constant";
import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { aznFields } from "@/util/productQueries/aznFields";
import { ebyFields } from "@/util/productQueries/ebyFields";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
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
  const target = searchParams.get("target");
  const isAmazon = target === "a";

  const customerSettings: Settings = settingsFromSearchQuery(searchParams);

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

  if (isAmazon) {
    aggregation.push(...aznFields({settings:customerSettings, sdmn: WHOLESALE_COL, isWholesale: true}));
  } else {
    aggregation.push(...ebyFields({settings:customerSettings, sdmn: WHOLESALE_COL}));
  }


  const productCol = await getProductCol()

  const sort: {
    [key: string]: SortDirection;
  } = {};

  sort["status"] = 1;

  if (query.field === "none") {
    sort[`${target}_mrgn`] = -1;
  } else if (query.field) {
    sort[query.field] = query.order === "asc" ? 1 : -1;
  }

  aggregation.push(
    {
      $match: {
        sdmn: WHOLESALE_COL,
        taskIds: params.id,
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
  const res = await productCol.aggregate(aggregation).toArray();

  if (
    process.env.NODE_ENV === "development"
  ) {
    console.log("WHOLESALE", JSON.stringify(aggregation));
  }

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
