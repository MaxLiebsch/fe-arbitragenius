import { ObjectId } from "mongodb";

export interface Task {
  type: string;
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
  total: number;
}

export interface DbTask extends Task {
  _id: ObjectId;
}
