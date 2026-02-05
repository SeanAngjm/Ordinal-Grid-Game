import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import StartScreen from "@/pages/StartScreen";
import GameScreen from "@/pages/GameScreen";

function Router() {
  const [gameSettings, setGameSettings] = useState<{
    mode: 'single' | 'dual';
    difficulty: 'warmup' | 'advanced';
  } | null>(null);

  return (
    <Switch>
      <Route path="/">
        <StartScreen onStart={setGameSettings} />
      </Route>
      <Route path="/game">
        {gameSettings ? (
          <GameScreen mode={gameSettings.mode} difficulty={gameSettings.difficulty} />
        ) : (
          <StartScreen onStart={setGameSettings} />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
