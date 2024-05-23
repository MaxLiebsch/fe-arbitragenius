import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.NEXT_MONGO ?? "");

export const mongoPromise = client.connect();

const adminClient = new MongoClient(process.env.NEXT_MONGO_CRAWLER_DATA_ADMIN ?? "");

export const mongoAdminPromise = adminClient.connect();


