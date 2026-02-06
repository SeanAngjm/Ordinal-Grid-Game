import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import StartScreen from "@/pages/StartScreen";
import GameScreen from "@/pages/GameScreen";

function Router() {
  const [location, setLocation] = useLocation();
  const [gameSettings, setGameSettings] = useState<{
    mode: 'single' | 'dual';
    difficulty: 'warmup' | 'advanced';
    sound: boolean;
  } | null>(null);

  const handleStart = (settings: { mode: 'single' | 'dual'; difficulty: 'warmup' | 'advanced'; sound: boolean }) => {
    setGameSettings(settings);
    setLocation("/game");
  };

  return (
    <Switch>
      <Route path="/">
        <StartScreen onStart={handleStart} />
      </Route>
      <Route path="/game">
        {gameSettings ? (
          <GameScreen mode={gameSettings.mode} difficulty={gameSettings.difficulty} initialSound={gameSettings.sound} />
        ) : (
          <StartScreen onStart={handleStart} />
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
