import { useState } from "react";
import { motion } from "framer-motion";
import { BubblyButton } from "@/components/BubblyButton";
import { User, Users, Zap, Grid, Play } from "lucide-react";
import { playSound } from "@/lib/audio";

interface StartScreenProps {
  onStart: (settings: { mode: 'single' | 'dual'; difficulty: 'warmup' | 'advanced' }) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [mode, setMode] = useState<'single' | 'dual'>('single');
  const [difficulty, setDifficulty] = useState<'warmup' | 'advanced'>('warmup');

  const handleStart = () => {
    playSound('start');
    onStart({ mode, difficulty });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[2.5rem] p-6 md:p-10 max-w-lg w-full shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50 blur-xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-200 rounded-full translate-x-1/3 translate-y-1/3 opacity-50 blur-xl" />

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-800 mb-2 tracking-tight">
            Math<span className="text-violet-500">Fun</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Ordinal Numbers Game</p>
        </div>

        <div className="space-y-8 relative z-10">
          {/* Mode Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Select Players</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { playSound('pop'); setMode('single'); }}
                className={`p-4 rounded-2xl border-4 transition-all duration-200 flex flex-col items-center gap-2 ${
                  mode === 'single' 
                    ? 'border-violet-500 bg-violet-50 text-violet-600' 
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <User className="w-8 h-8" />
                <span className="font-bold">Solo</span>
              </button>
              <button
                onClick={() => { playSound('pop'); setMode('dual'); }}
                className={`p-4 rounded-2xl border-4 transition-all duration-200 flex flex-col items-center gap-2 ${
                  mode === 'dual' 
                    ? 'border-violet-500 bg-violet-50 text-violet-600' 
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <Users className="w-8 h-8" />
                <span className="font-bold">2 Players</span>
              </button>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Select Mode</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { playSound('pop'); setDifficulty('warmup'); }}
                className={`p-4 rounded-2xl border-4 transition-all duration-200 flex flex-col items-center gap-2 ${
                  difficulty === 'warmup' 
                    ? 'border-orange-400 bg-orange-50 text-orange-500' 
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-8 h-8" />
                <span className="font-bold">Linear</span>
              </button>
              <button
                onClick={() => { playSound('pop'); setDifficulty('advanced'); }}
                className={`p-4 rounded-2xl border-4 transition-all duration-200 flex flex-col items-center gap-2 ${
                  difficulty === 'advanced' 
                    ? 'border-pink-400 bg-pink-50 text-pink-500' 
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-8 h-8" />
                <span className="font-bold">Grid</span>
              </button>
            </div>
          </div>

          <BubblyButton 
            onClick={handleStart} 
            size="lg" 
            className="w-full mt-8 flex items-center justify-center gap-3 text-2xl group"
          >
            Start Game <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
          </BubblyButton>
        </div>
      </motion.div>
    </div>
  );
}
