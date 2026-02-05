
import { db } from "./db";
import {
  gameSessions,
  type InsertGameSession,
  type GameSession
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getRecentSessions(limit?: number): Promise<GameSession[]>;
}

export class DatabaseStorage implements IStorage {
  async createGameSession(session: InsertGameSession): Promise<GameSession> {
    const [newSession] = await db
      .insert(gameSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getRecentSessions(limit: number = 10): Promise<GameSession[]> {
    return await db
      .select()
      .from(gameSessions)
      .orderBy(desc(gameSessions.completedAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
