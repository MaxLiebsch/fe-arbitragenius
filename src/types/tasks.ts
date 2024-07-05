import { ObjectId } from "mongodb";

export interface Task {
  type: string;
  id: string;
  browserConcurrency: number;
  concurrency: number;
  recurrent: boolean;
  startedAt: string;
  createdAt: string;
  completedAt: string;
  errored: boolean;
  maintenance: boolean;
  lastCrawler: any[];
  productLimit: number;
  userId: string;
  executing: boolean;
  progress: Progress;
}

export interface Progress {
  pending: number;
  completed: number;
  total: number;
}

export interface DbTask extends Task {
  _id: ObjectId;
}
