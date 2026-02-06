import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { generateQuestions, getQuestionText, getSpokenText } from "@/lib/game-logic";
import { GameArea } from "@/components/GameArea";
import { Timer } from "@/components/Timer";
import { speak, playSound } from "@/lib/audio";
import { useCreateGameSession } from "@/hooks/use-games";
import ResultScreen from "./ResultScreen";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { BubblyButton } from "@/components/BubblyButton";

interface GameProps {
  mode: 'single' | 'dual';
  difficulty: 'warmup' | 'advanced';
}

export default function GameScreen({ mode, difficulty }: GameProps) {
  const [_, setLocation] = useLocation();
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questions] = useState(() => generateQuestions(5, difficulty));
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'round-end' | 'finished'>('ready');
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Track who answered in current round
  const [p1Answered, setP1Answered] = useState(false);
  const [p2Answered, setP2Answered] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const createSession = useCreateGameSession();

  // Start round logic
  useEffect(() => {
    if (gameState === 'ready' || gameState === 'round-end') {


      // Prepare next round
      setP1Answered(false);
      setP2Answered(false);
      setTimeLeft(10);
      
      // Delay start slightly for transitions
      const startTimeout = setTimeout(() => {
        setGameState('playing'); 
      }, 1000);

      return () => clearTimeout(startTimeout);
    }
  }, [round, gameState]);
// sound logic
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!soundEnabled) return;
  
    const q = questions[round];
    if (!q) return;
  
    // 🔴 CRITICAL: stop any previous speech
    speechSynthesis.cancel();
  
    speak(getSpokenText(q));
  }, [round, gameState, soundEnabled]);
  
  // Timer logic
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            handleRoundEnd();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Check if round should end early (all players answered)
  useEffect(() => {
    if (gameState === 'playing') {
      const allAnswered = mode === 'single' ? p1Answered : (p1Answered && p2Answered);
      if (allAnswered) {
        handleRoundEnd();
      }
    }
  }, [p1Answered, p2Answered, mode, gameState]);

  const handleRoundEnd = () => {
    speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('round-end');
    setTimeout(() => {
      setRound(r => {
        if (r + 1 >= questions.length) {
          setGameState('finished');
          return r; // do NOT go to invalid round
        }
        return r + 1;
      });
    }, 1500);
  };

  const handleP1Answer = (correct: boolean) => {
    if (p1Answered) return;
    setP1Answered(true);
    if (correct) setP1Score(s => s + 1);
  };

  const handleP2Answer = (correct: boolean) => {
    if (p2Answered) return;
    setP2Answered(true);
    if (correct) setP2Score(s => s + 1);
  };

  if (gameState === 'finished') {
    return (
      <ResultScreen 
        p1Score={p1Score} 
        p2Score={p2Score} 
        mode={mode} 
        onRestart={() => window.location.reload()} 
      />
    );
  }

  const currentQuestion = questions[round] || questions[0];
  const questionText = getQuestionText(currentQuestion);
  const isOddRound = (round + 1) % 2 !== 0;

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden touch-none">
      
      {/* Header / Controls Area */}
      <div className="flex-none h-16 md:h-20 bg-white shadow-sm px-4 flex items-center justify-between z-10 border-b border-slate-100">
        <button onClick={() => setLocation("/")} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>
        
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {round + 1}/{questions.length}</span>
          <div
            className="
              text-xl md:text-3xl 
              font-display font-extrabold 
              text-yellow-300 
              drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]
            "
          >
            {questionText}
          </div>
        </div>

        <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          {soundEnabled ? <Volume2 className="w-6 h-6 text-violet-500" /> : <VolumeX className="w-6 h-6 text-slate-300" />}
        </button>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Player 1 Area */}
        <div className={`flex-1 relative p-2 md:p-6 border-b md:border-b-0 md:border-r border-slate-200 transition-opacity duration-300 ${p1Answered ? 'opacity-50 grayscale-[0.5]' : ''}`}>
          {/* Label for Dual Mode */}
          {mode === 'dual' && (
            <div className="absolute top-4 left-4 z-10 bg-orange-100 text-orange-600 px-3 py-1 rounded-lg font-bold text-sm shadow-sm border border-orange-200">
              Player 1
            </div>
          )}
          
          <GameArea 
            question={currentQuestion}
            isActive={gameState === 'playing' && !p1Answered}
            onAnswer={handleP1Answer}
            playerSide={mode === 'single' ? 'single' : 'left'}
          />

          {/* Correct/Wrong Overlay Feedback */}
          <AnimatePresence>
            {p1Answered && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
               >
                 {/* This could be an icon or text indicating wait */}
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Player 2 Area (Only visible in Dual Mode) */}
        {mode === 'dual' && (
          <div className={`flex-1 relative p-2 md:p-6 transition-opacity duration-300 ${p2Answered ? 'opacity-50 grayscale-[0.5]' : ''}`}>
            <div className="absolute top-4 right-4 z-10 bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-bold text-sm shadow-sm border border-blue-200">
              Player 2
            </div>
            
            <GameArea 
              question={currentQuestion}
              isActive={gameState === 'playing' && !p2Answered}
              onAnswer={handleP2Answer}
              playerSide="right"
            />
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className={`flex-none bg-white p-4 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors duration-500 ${isOddRound ? 'border-t-4 border-orange-200' : 'border-t-4 border-blue-200'}`}>
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Timer */}
          <Timer current={timeLeft} total={10} />

          {/* Scores */}
          <div className="flex justify-between items-end px-4">
            <div className="text-center">
              <div className="text-xs font-bold text-orange-300 uppercase">P1 Score</div>
              <div className="text-3xl font-display font-bold text-orange-500 tabular-nums leading-none">{p1Score}</div>
            </div>

            {mode === 'dual' && (
              <div className="text-center">
                <div className="text-xs font-bold text-blue-300 uppercase">P2 Score</div>
                <div className="text-3xl font-display font-bold text-blue-500 tabular-nums leading-none">{p2Score}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ready / Feedback Overlay */}
      <AnimatePresence>
        {gameState === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-8 shadow-2xl text-center"
            >
              <h2 className="text-4xl font-display font-bold text-violet-600 mb-2">Round {round + 1}</h2>
              <p className="text-slate-400 font-bold uppercase">Get Ready!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
