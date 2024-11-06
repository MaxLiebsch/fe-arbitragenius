import { PRODUCT_COL } from "@/constant/constant";
import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import {
  Bookmark,
  BookmarkByTarget,
  BookmarkDeleteSchema,
  BookmarkSchema,
} from "@/types/Bookmarks";
import { Settings } from "@/types/Settings";
import {
  mrgnFieldName,
  mrgnPctFieldName,
} from "@/util/productQueries/mrgnProps";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { roundToTwoDecimals } from "@/util/roundToTwoDecimals";
import { ObjectId, WithId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });
  const searchParams = request.nextUrl.searchParams;
  const customerSettings: Settings = settingsFromSearchQuery(searchParams);

  const { fba, a_prepCenter, a_strg, a_tptStandard, euProgram } =
    customerSettings;
  const isEuProgram = !euProgram ? "_p" : "";
  const strg_1_hy = new Date().getMonth() < 9;
  const mongo = await clientPool["NEXT_MONGO_ADMIN"];
  const spotterDb = mongo.db(process.env.NEXT_MONGO_DB ?? "");
  const users = spotterDb.collection("users");
  const productCol = spotterDb.collection(PRODUCT_COL);

  /*
    Aggregagte bookmarks in chunks of 10
    Retrieve the products from the product collection with the ids from the bookmarks
    */
  const userData = await users.findOne({ userId: user.$id });
  if (!userData || userData.bookmarks.length === 0)
    return new Response(JSON.stringify({ ebay: [], amazon: [] }), {
      status: 404,
    });

  const bookmarks = userData.bookmarks;

  // Gruppiere die Bookmarks nach Shop

  const bookmarksByTarget = bookmarks.reduce(
    (acc: BookmarkByTarget, bookmark: Bookmark) => {
      if (acc[bookmark.target]) {
        if (!acc[bookmark.target][bookmark.shop]) {
          acc[bookmark.target][bookmark.shop] = [];
        }
        acc[bookmark.target][bookmark.shop].push(bookmark.productId);
      } else {
        acc[bookmark.target] = { [bookmark.shop]: [bookmark.productId] };
      }
      return acc;
    },
    {}
  ) as BookmarkByTarget;

  // Abfragen für jede Shop-Kollektion in Stapeln
  interface ProductsByTarget {
    [key: string]: WithId<Document>[];
  }
  const productByTarget = await Object.entries(bookmarksByTarget).reduce(
    async (accPromise, [target, shops]) => {
      const acc = await accPromise;
      const products = Object.entries(shops).map(async ([shop, productIds]) => {
        const products = await productCol
          .find({
            _id: { $in: productIds },
          })
          .toArray();

        return products.map((product) => {
          if (shop === "flip") {
            let avgPrice = 0;
            let {
              avg30_ansprcs,
              avg30_ahsprcs,
              avg90_ahsprcs,
              avg90_ansprcs,
              a_qty,
              a_prc,
              qty,
              costs,
            } = product;

            if (avg30_ahsprcs && avg30_ahsprcs > 0) {
              avgPrice = avg30_ahsprcs;
            } else if (avg30_ansprcs && avg30_ansprcs > 0) {
              avgPrice = avg30_ansprcs;
            } else if (avg90_ahsprcs && avg90_ahsprcs > 0) {
              avgPrice = avg90_ahsprcs;
            } else if (avg90_ansprcs && avg90_ansprcs > 0) {
              avgPrice = avg90_ansprcs;
            }

            avgPrice = roundToTwoDecimals(avgPrice / 100);
            const tax = roundToTwoDecimals(
              avgPrice - avgPrice / (1 + product.tax / 100)
            );
            const factor = a_qty / qty;
            const buyPrice = roundToTwoDecimals((a_prc / 1.19) * factor);

            const externalCosts = fba
              ? costs.tpt + costs[strg_1_hy ? "strg_1_hy" : "strg_2_hy"]
              : a_strg +
                a_prepCenter +
                customerSettings[a_tptStandard as "a_tptSmall"];

            const earning =
              (avgPrice -
                costs.azn -
                costs.varc -
                externalCosts -
                tax -
                buyPrice) *
              qty;

            // VK - Kosten - Steuern - EK / VK * 100
            const margin =
              ((avgPrice -
                costs.azn -
                costs.varc -
                externalCosts -
                tax -
                buyPrice) /
                avgPrice) *
              100;

            return {
              ...product,
              a_avg_prc: avgPrice,
              [mrgnFieldName("a", euProgram)]: roundToTwoDecimals(earning),
              [mrgnPctFieldName("a", euProgram)]: roundToTwoDecimals(margin),
              isBookmarked: true,
              shop,
            };
          }
          return {
            ...product,
            isBookmarked: true,
            shop,
          };
        });
      });
      const productsByShop = await Promise.all(products);

      acc[target] = productsByShop.flat() as unknown as WithId<Document>[];
      return acc;
    },
    Promise.resolve({} as ProductsByTarget)
  );

  return new Response(JSON.stringify(productByTarget), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const body = await request.json();

  const form = BookmarkSchema.safeParse(body);
  if (!form.success) return new Response("invalid", { status: 400 });

  const mongo = await clientPool["NEXT_MONGO_ADMIN"];
  const spotterDb = mongo.db(process.env.NEXT_MONGO_DB ?? "");
  const users = spotterDb.collection("users");
  const bookmark = form.data;
  const bookmarkId = new ObjectId(bookmark.productId);

  const response = await users.updateOne(
    { userId: user.$id },
    {
      $addToSet: {
        bookmarks: {
          productId: bookmarkId,
          shop: bookmark.shop,
          target: bookmark.target,
        },
      },
    },
    { upsert: true }
  );
  if (response.modifiedCount === 0) {
    return new Response("already exists", { status: 409 });
  }
  return new Response("success", { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });

  const body = await request.json();

  const form = BookmarkDeleteSchema.safeParse(body);
  if (!form.success) return new Response("invalid", { status: 400 });

  const mongo = await clientPool["NEXT_MONGO_ADMIN"];
  const spotterDb = mongo.db(process.env.NEXT_MONGO_DB ?? "");
  const users = spotterDb.collection("users");
  const bookmark = form.data;
  const bookmarkId = new ObjectId(bookmark.productId);
  const update = {
    $pull: {
      bookmarks: {
        productId: bookmarkId,
        target: bookmark.target,
        shop: bookmark.shop,
      },
    },
  };
  //@ts-ignore
  const response = await users.findOneAndUpdate({ userId: user.$id }, update);
  if (response.modifiedCount === 0) {
    return new Response("not found", { status: 404 });
  }
  return new Response("success", { status: 200 });
}
