import { getLoggedInUser } from "@/server/appwrite";
import { getProductCol } from "@/server/mongo";
import clientPool from "@/server/mongoPool";
import {
  Bookmark,
  BookmarkByTarget,
  BookmarkDeleteSchema,
  BookmarkSchema,
} from "@/types/Bookmarks";
import { ModifiedProduct } from "@/types/Product";
import { Settings } from "@/types/Settings";
import { aznFields } from "@/util/productQueries/aznFields";
import { aznFlipFields } from "@/util/productQueries/aznFlipFields";
import { ebyFields } from "@/util/productQueries/ebyFields";
import { projectField } from "@/util/productQueries/projectField";
import { settingsFromSearchQuery } from "@/util/productQueries/settingsFromSearchQuery";
import { ObjectId, WithId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });
  const searchParams = request.nextUrl.searchParams;
  const customerSettings: Settings = settingsFromSearchQuery(searchParams);
  const mongo = await clientPool["NEXT_MONGO_ADMIN"];
  const spotterDb = mongo.db(process.env.NEXT_MONGO_DB ?? "");
  const users = spotterDb.collection("users");
  const productCol = await getProductCol();

  /*
    Aggregagte bookmarks in chunks of 10
    Retrieve the products from the product collection with the ids from the bookmarks
    */
  const userData = await users.findOne({ userId: user.$id });
  if (!userData || userData.bookmarks.length === 0)
    return new Response(JSON.stringify({ ebay: [], amazon: [] }), {
      status: 404,
    });

  const bookmarks = userData.bookmarks as Bookmark[];

  // Gruppiere die Bookmarks nach Shop
  // a, e, flip
  const groupedBookmarksByTarget = bookmarks.reduce(
    (acc: BookmarkByTarget, bookmark: Bookmark) => {
      const { target, shop } = bookmark;
      if (shop === "flip") {
        if (!acc[shop]) {
          acc[shop] = [];
        }
        acc[shop].push(bookmark.productId);
      } else if (acc[bookmark.target]) {
        if (!acc[bookmark.target]) {
          acc[bookmark.target] = [];
        }
        acc[bookmark.target].push(bookmark.productId);
      } else {
        acc[bookmark.target] = [bookmark.productId];
      }
      return acc;
    },
    {}
  ) as BookmarkByTarget;

  // Abfragen für jede Shop-Kollektion in Stapeln
  interface ProductsByTarget {
    [key: string]: WithId<ModifiedProduct>[];
  }

  const aggregation: any[] = [
    {
      $match: {
        _id: { $in: bookmarks.map((b) => b.productId) },
      },
    },
    {
      $facet: {},
    },
    {
      $project: {
        a: {
          $concatArrays: [{ $ifNull: ["$a", []] }, { $ifNull: ["$flip", []] }],
        },
        e: { $ifNull: ["$e", []] },
      },
    },
  ];

  if (groupedBookmarksByTarget.e) {
    aggregation[1].$facet["e"] = [
      { $match: { _id: { $in: groupedBookmarksByTarget.e } } },
      ...ebyFields(customerSettings),
      {
        $project: {
          ...projectField("e", "$sdmn").$project,
          isBookmarked: { $literal: true },
        },
      },
    ];
  }
  if (groupedBookmarksByTarget.flip) {
    aggregation[1].$facet["flip"] = [
      { $match: { _id: { $in: groupedBookmarksByTarget.flip } } },
      ...aznFlipFields(customerSettings),
      {
        $project: {
          ...projectField("a", "flip").$project,
          isBookmarked: { $literal: true },
        },
      },
    ];
  }
  if (groupedBookmarksByTarget.a) {
    aggregation[1].$facet["a"] = [
      { $match: { _id: { $in: groupedBookmarksByTarget.a } } },
      ...aznFields(customerSettings),
      {
        $project: {
          ...projectField("a", "$sdmn").$project,
          isBookmarked: { $literal: true },
        },
      },
    ];
  }
  const products = await productCol.aggregate(aggregation).toArray();

  if (process.env.NODE_ENV === "development") {
    console.log("AZNAGGBCOUNT", JSON.stringify(aggregation));
  }

  const productsReturn = products.length
    ? (products[0] as ProductsByTarget)
    : {};

  const flatProducts = Object.values(productsReturn).flat();
  const obsoleteBookmarks = bookmarks.filter((bookmark) => {
    return !flatProducts.some(
      (product) => product._id.toString() === bookmark.productId.toString()
    );
  });

  if (obsoleteBookmarks.length > 0) {
    const update: any = {
      $pull: {
        bookmarks: {
          productId: {
            $in: obsoleteBookmarks.map((b) => b.productId),
          },
        },
      },
    };
    await users.findOneAndUpdate({ userId: user.$id }, update);
  }

  Object.entries(productsReturn).forEach(([key, value]) => {
    productsReturn[key] = value.map((product: ModifiedProduct) => {
      const bookmark = bookmarks.find(b => b.productId.toString() === product._id.toString());
      product.bookmarkedAt = bookmark?.createdAt;
      return product;
    });
  });

  return new Response(JSON.stringify(productsReturn), {
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
          createdAt: new Date().getTime(),
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
