import { ObjectId } from "mongodb";
import Ajv, { JSONSchemaType } from "ajv";
import { ProductRow } from "./wholesaleProduct";
const ajv = new Ajv();

export type WholeSaleTarget = "a" | "e";

export interface MutateTaskRequest {
  target: WholeSaleTarget[];
  products: ProductRow[];
}

export interface Task {
  type: string;
  id: string;
  concurrency: number;
  recurrent: boolean;
  startedAt: string;
  createdAt: string;
  completedAt: string;
  errored: boolean;
  maintenance: boolean;
  lastCrawler: any[];
  productLimit: number;
  executing: boolean;
}

export interface Progress {
  pending: number;
  completed: number;
  total: number;
}

export interface DbTask extends Task {
  _id: ObjectId;
  progress: Progress;
}

export interface WholeSaleTask extends Task {
  userId: string;
  browserConcurrency: number;
  progress: Progress;
}

export interface WholeSaleEbyTask extends Task{
  userId: string;
  progress: Progress;
  browserConfig: { 
    queryEansOnEby: {
      concurrency: number;
      productLimit: number;
    };
    lookupCategory: {
      concurrency: number;
      productLimit: number;
    };
  }
}

export interface CrawlTask extends Task {
  categories: Category[];
  cooldown: string;
  _id: string;
  limit: Limit;
  weekday: number;
  visitedPages: string[];
  retry: number;
  shopDomain: string;
}

export interface Limit {
  mainCategory: number;
  subCategory: number;
  pages: number;
}

export interface Category {
  name: string;
  link: string;
}

export const taskSchema: JSONSchemaType<CrawlTask> = {
  type: "object",
  properties: {
    _id: { type: "string" },
    type: { type: "string" },
    shopDomain: { type: "string" },
    retry: { type: "integer" },
    id: { type: "string" },
    visitedPages: { type: "array", items: { type: "string" } },
    weekday: { type: "integer" },
    limit: {
      type: "object",
      properties: {
        mainCategory: { type: "integer" },
        subCategory: { type: "integer" },
        pages: { type: "integer" },
      },
      required: [],
    },
    concurrency: { type: "integer" },
    recurrent: { type: "boolean" },
    startedAt: { type: "string" },
    createdAt: { type: "string" },
    completedAt: { type: "string" },
    errored: { type: "boolean" },
    categories: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, link: { type: "string" } },
        required: ["name", "link"],
      },
    },
    cooldown: { type: "string" },
    maintenance: { type: "boolean" },
    lastCrawler: { type: "array", items: { type: "string" } },
    productLimit: { type: "integer" },
    executing: { type: "boolean" },
  },
  required: [
    // 'id',
    // 'type',
    // 'completedAt',
    // "startedAt",
    // "shopDomain",
    // 'maintenance',
    // "categories",
    // "cooldown",
    // 'productLimit',
    // 'retry',
    // "limit",
    // "weekday",
    // "executing",
    // "recurrent",
  ],
  additionalProperties: true,
};
