import type { MongoClient } from "mongodb";

export interface MonsterOptions {
  url: string;
  client: MongoClient;
}