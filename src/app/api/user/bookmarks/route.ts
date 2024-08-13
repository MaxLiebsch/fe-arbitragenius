import { getLoggedInUser } from "@/server/appwrite";
import clientPool from "@/server/mongoPool";
import {
  Bookmark,
  BookmarkByTarget,
  BookmarkDeleteSchema,
  BookmarkSchema,
} from "@/types/Bookmarks";
import { ObjectId, WithId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getLoggedInUser();
  if (!user) return new Response("unauthorized", { status: 401 });
  const searchParams = request.nextUrl.searchParams;
  const mongo = await clientPool["NEXT_MONGO_ADMIN"];
  const spotterDb = mongo.db(process.env.NEXT_MONGO_DB ?? "");
  const users = spotterDb.collection("users");

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
        const collection = spotterDb.collection(shop);
        const products = await collection
          .find({
            _id: { $in: productIds },
          })
          .toArray();

        return products.map((product) => ({
          ...product,
          isBookmarked: true,
          shop,
        }));
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
