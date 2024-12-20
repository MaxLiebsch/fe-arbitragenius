import { MAX_CACHE_SIZE, TTL_UPCOMING_REQUEST } from "@/constant/constant";
import { LRUCache } from "lru-cache";

export const subScriptionCache = new LRUCache<string, any>({
  max: MAX_CACHE_SIZE,
  ttl: TTL_UPCOMING_REQUEST,
  ttlAutopurge: true,
});
