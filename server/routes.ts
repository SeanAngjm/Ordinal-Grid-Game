
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Record a finished game
  app.post(api.games.create.path, async (req, res) => {
    try {
      const input = api.games.create.input.parse(req.body);
      const session = await storage.createGameSession(input);
      res.status(201).json(session);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Get history
  app.get(api.games.history.path, async (req, res) => {
    try {
      const history = await storage.getRecentSessions();
      res.json(history);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}
