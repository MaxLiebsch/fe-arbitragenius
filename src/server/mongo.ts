import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.NEXT_MONGO ?? "");

export const mongoPromise = client.connect();
