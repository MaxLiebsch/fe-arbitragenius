import { ObjectId } from "mongodb";
import { z } from "zod";
import { BookMarkProduct } from "./Product";

export const BookmarkSchema = z.object({
  productId: z.string(),
  shop: z.string(),
  target: z.string(),
});

export type BookmarkSchema = z.infer<typeof BookmarkSchema>;


export const BookmarkDeleteSchema = z.object({ productId: z.string(), target: z.string(), shop: z.string() });
export type BookmarkDeleteSchema = z.infer<typeof BookmarkDeleteSchema>;

 export interface BookmarkByTarget {
    [key: string]: { [key: string]: ObjectId[] };
  }
 export interface Bookmark {
    shop: string;
    productId: ObjectId;
    target: string;
  }

export interface BookMarkReturn { e:BookMarkProduct[]; a: BookMarkProduct[] }