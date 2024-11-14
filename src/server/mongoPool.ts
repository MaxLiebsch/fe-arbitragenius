import { MongoClient } from "mongodb";
import "dotenv/config";
import { config } from "dotenv";

config({
  path: [`.env.${process.env.NODE_ENV}`],
});

const uris = Object.entries(process.env).filter(
  ([key, config]) =>
    key === "NEXT_MONGO" ||
    key === "NEXT_MONGO_ADMIN" ||
    key === "NEXT_MONGO_CRAWLER_DATA_ADMIN"
) as [string, string][];

const options = {};

let client: MongoClient;
let clientPool: { [key: string]: Promise<MongoClient> } = {};

if (!uris) {
  throw new Error("Please add your Mongo URI to .env.<environment>");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPool) {
    (global as any)._mongoClientPool = {};
    uris.map(([key, uri]) => {
      client = new MongoClient(uri, options);
      (global as any)._mongoClientPool[key] =
        client.connect();
    });
  }
  clientPool = (global as any)._mongoClientPool;
} else {
  // In production mode, it's best to not use a global variable.
  uris.map(([key, uri]) => {
    client = new MongoClient(uri, options);
    clientPool[key] = client.connect();
  });
}

export default clientPool;
