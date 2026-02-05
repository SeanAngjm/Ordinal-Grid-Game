import { motion } from "framer-motion";
import { BubblyButton } from "@/components/BubblyButton";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { Trophy, Star, RotateCcw, Home } from "lucide-react";
import { playSound } from "@/lib/audio";

interface ResultScreenProps {
  p1Score: number;
  p2Score?: number;
  mode: 'single' | 'dual';
  onRestart: () => void;
}

export default function ResultScreen({ p1Score, p2Score, mode, onRestart }: ResultScreenProps) {
  const [_, setLocation] = useLocation();
  const maxScore = 5;

  useEffect(() => {
    // Determine if we should celebrate
    const totalScore = p1Score + (p2Score || 0);
    const threshold = mode === 'single' ? 3 : 5;
    
    if (totalScore >= threshold) {
      playSound('correct');
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, []);

  const getMessage = () => {
    if (mode === 'single') {
      if (p1Score === 5) return "Amazing! Perfect Score!";
      if (p1Score >= 3) return "Great Job!";
      return "Keep Practicing!";
    } else {
      if (p1Score > (p2Score || 0)) return "Player 1 Wins!";
      if ((p2Score || 0) > p1Score) return "Player 2 Wins!";
      return "It's a Draw!";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2rem] p-8 max-w-2xl w-full shadow-xl border-4 border-slate-100 text-center"
      >
        <motion.div 
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ delay: 0.5, duration: 1 }}
          className="inline-block p-4 rounded-full bg-yellow-100 mb-6"
        >
          <Trophy className="w-16 h-16 text-yellow-500" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-violet-600 mb-2">
          {getMessage()}
        </h1>
        
        <p className="text-slate-400 font-bold text-lg mb-12 uppercase tracking-widest">Game Over</p>

        <div className="flex flex-col md:flex-row gap-8 justify-center mb-12">
          <div className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-100 w-full">
            <h3 className="text-orange-400 font-bold uppercase mb-2 text-sm tracking-wider">Player 1</h3>
            <div className="text-6xl font-display font-bold text-orange-500 text-shadow">
              {p1Score}<span className="text-2xl text-orange-300">/{maxScore}</span>
            </div>
            <div className="flex justify-center mt-2 gap-1">
              {Array.from({ length: p1Score }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-orange-400 fill-orange-400" />
              ))}
            </div>
          </div>

          {mode === 'dual' && (
             <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100 w-full">
              <h3 className="text-blue-400 font-bold uppercase mb-2 text-sm tracking-wider">Player 2</h3>
              <div className="text-6xl font-display font-bold text-blue-500 text-shadow">
                {p2Score}<span className="text-2xl text-blue-300">/{maxScore}</span>
              </div>
              <div className="flex justify-center mt-2 gap-1">
                {Array.from({ length: p2Score || 0 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-blue-400 fill-blue-400" />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <BubblyButton onClick={onRestart} size="lg" className="flex items-center gap-2">
            <RotateCcw className="w-6 h-6" /> Play Again
          </BubblyButton>
          <BubblyButton onClick={() => setLocation("/")} variant="secondary" size="lg" className="flex items-center gap-2">
            <Home className="w-6 h-6" /> Home
          </BubblyButton>
        </div>
      </motion.div>
    </div>
  );
}
