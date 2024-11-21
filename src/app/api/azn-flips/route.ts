import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { aznFlipFields } from "@/util/productQueries/aznFlipFields";

import { ebyFields } from "@/util/productQueries/ebyFields";
import { lookupUserId } from "@/util/productQueries/lookupUserId";
import { marginField } from "@/util/productQueries/marginFields";

import { projectField } from "@/util/productQueries/projectField";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { sortingField } from "@/util/productQueries/sortingField";
import { SortDirection } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string; target: string } }
) {
  const user = await getLoggedInUser();
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const searchParams = request.nextUrl.searchParams;
  const target = searchParams.get("target") || "a";

  const isAmazon = target === "a";

  const customerSettings: Settings = settingsFromSearchQuery(searchParams);

  let { minMargin, minPercentageMargin, netto, euProgram } = customerSettings;

  if (netto) {
    minMargin = Number((minMargin * 1.19).toFixed(0));
    minPercentageMargin = Number((minPercentageMargin * 1.19).toFixed(0));
  }

  const aggregation: { [key: string]: any }[] = [];

  if (isAmazon) {
    aggregation.push(...aznFlipFields(customerSettings));
  } else {
    aggregation.push(...ebyFields(customerSettings));
  }

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

  const sort: {
    [key: string]: SortDirection;
  } = {};

  sortingField(isAmazon, query, sort, euProgram);

  aggregation.push(
    {
      $match: {
        ...marginField({ target, settings: customerSettings }),
      },
    },
    projectField("a"),
    {
      $group: {
        _id: {
          field2: "$asin",
        },
        document: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$document" },
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

  lookupUserId(aggregation, user, target);
  const productCol = await getProductCol();

  const res = await productCol.aggregate(aggregation).toArray();

  return Response.json(res);
}
