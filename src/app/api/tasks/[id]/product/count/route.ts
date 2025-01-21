import { WHOLESALE_COL } from "@/constant/constant";
import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
import { Settings } from "@/types/Settings";
import { aznFields } from "@/util/productQueries/aznFields";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getLoggedInUser();
  const searchParams = request.nextUrl.searchParams;
  const customerSettings: Settings = settingsFromSearchQuery(searchParams);

  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const col = await getProductCol();
  const aggregation = [
    {
      $match: {
        taskIds: params.id,
        sdmn: WHOLESALE_COL,
      },
    },
    ...aznFields(customerSettings, WHOLESALE_COL, true) ,
    {$count: "count"}
  ]
  if (process.env.NODE_ENV === "development") {
    console.log("WHOLESALECOUNT", JSON.stringify(aggregation));
  }
  const res = await col
    .aggregate(aggregation)
    .toArray();

  return Response.json(res[0].count);
}
