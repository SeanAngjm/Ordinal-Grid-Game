
import { z } from 'zod';
import { insertGameSessionSchema, gameSessions } from './schema';

// === API CONTRACT ===
export const api = {
  games: {
    create: {
      method: 'POST' as const,
      path: '/api/games',
      input: insertGameSessionSchema,
      responses: {
        201: z.custom<typeof gameSessions.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/games/history',
      responses: {
        200: z.array(z.custom<typeof gameSessions.$inferSelect>()),
      },
    }
  }
};

// === HELPER ===
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
