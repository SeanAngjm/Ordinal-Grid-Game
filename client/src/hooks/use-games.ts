import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type InsertGameSession } from "@shared/routes";

export function useGameHistory() {
  return useQuery({
    queryKey: [api.games.history.path],
    queryFn: async () => {
      const res = await fetch(api.games.history.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.games.history.responses[200].parse(await res.json());
    },
  });
}

export function useCreateGameSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertGameSession) => {
      const res = await fetch(api.games.create.path, {
        method: api.games.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save game session");
      return api.games.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.games.history.path] });
    },
  });
}
