
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
// Store game history for analytics/progress tracking
export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  mode: text("mode").notNull(), // 'single' | 'dual'
  difficulty: text("difficulty").notNull(), // 'warmup' | 'advanced'
  player1Score: integer("player1_score").notNull(),
  player2Score: integer("player2_score"), // Nullable for single player
  completedAt: timestamp("completed_at").defaultNow(),
});

// === SCHEMAS ===
export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({ 
  id: true, 
  completedAt: true 
});

// === API TYPES ===
export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;

// Game Logic Types (Not in DB, but shared)
export type Direction = 'left' | 'right' | 'top' | 'bottom';
export type QuestionType = 'linear' | 'grid';

export interface GameQuestion {
  id: string;
  type: QuestionType;
  targetIndex: number; // 0-based index
  totalItems: number;
  direction: Direction;
  rows?: number; // For grid mode
  cols?: number; // For grid mode
  targetRow?: number; // For grid mode
  targetCol?: number; // For grid mode
  description: string; // "Find the 3rd from the left"
}

export interface PlayerState {
  score: number;
  hasAnswered: boolean;
  isCorrect: boolean | null;
}
