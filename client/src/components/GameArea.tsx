import { motion, AnimatePresence } from "framer-motion";
import { type GameQuestion } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { playSound } from "@/lib/audio";

interface GameAreaProps {
  question: GameQuestion;
  isActive: boolean;
  onAnswer: (isCorrect: boolean) => void;
  playerSide: 'left' | 'right' | 'single';
}

export function GameArea({ question, isActive, onAnswer, playerSide }: GameAreaProps) {
  const [answeredIndex, setAnsweredIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Reset local state when question changes
  useEffect(() => {
    setAnsweredIndex(null);
    setIsCorrect(null);
  }, [question.id]);

  const handleItemClick = (index: number) => {
    if (!isActive || answeredIndex !== null) return;
    
    const correct = index === question.targetIndex;
    setAnsweredIndex(index);
    setIsCorrect(correct);
    
    playSound(correct ? 'correct' : 'wrong');
    
    // Add small delay before notifying parent to allow animation to play
    setTimeout(() => {
      onAnswer(correct);
    }, 800);
  };

  const getGridStyle = () => {
    if (question.type === 'linear') {
      return "flex flex-row justify-center items-center gap-2 sm:gap-4 flex-wrap content-center h-full";
    }
    return `grid grid-cols-${question.cols} gap-2 sm:gap-4 justify-center content-center h-full max-w-[80%] mx-auto`;
  };

  const animalEmojis = ["🦁", "🐯", "🐼", "🐨", "🐸", "🐷", "🦊", "🐶", "🐱"];
  // Deterministic emoji based on question ID to keep it consistent during re-renders
  const getEmoji = (idx: number) => {
    const seed = question.id.charCodeAt(0) + idx;
    return animalEmojis[seed % animalEmojis.length];
  };

  return (
    <div className={cn(
      "relative w-full h-full p-4 rounded-3xl overflow-hidden transition-colors duration-300",
      playerSide === 'left' ? "bg-orange-50/50" : playerSide === 'right' ? "bg-blue-50/50" : "bg-white/50"
    )}>
      {/* Visual Direction Indicator (Warmup Mode) */}
      {question.type === 'linear' && (
        <div className="absolute top-2 left-0 right-0 flex justify-between px-4 text-slate-400 font-display text-sm font-bold opacity-50 uppercase tracking-widest pointer-events-none">
          {question.direction === 'left' ? (
            <motion.span 
              animate={{ x: [0, 5, 0], opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-primary"
            >
              ← START (Left)
            </motion.span>
          ) : (
             <span>Left</span>
          )}
          
          {question.direction === 'right' ? (
             <motion.span 
              animate={{ x: [0, -5, 0], opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-primary"
            >
              (Right) START →
            </motion.span>
          ) : (
            <span>Right</span>
          )}
        </div>
      )}

      {/* Grid/Linear Container */}
      <div 
        className={getGridStyle()}
        style={question.type === 'grid' ? {
          display: 'grid',
          gridTemplateColumns: `repeat(${question.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${question.rows}, minmax(0, 1fr))`
        } : {}}
      >
        {Array.from({ length: question.totalItems }).map((_, i) => {
          const isSelected = answeredIndex === i;
          const isTarget = i === question.targetIndex;
          
          let stateClass = "bg-white border-slate-200";
          let scale = 1;
          
          if (isSelected) {
            if (isCorrect) {
              stateClass = "bg-green-400 border-green-600 shadow-[0_0_20px_rgba(74,222,128,0.5)]";
              scale = 1.1;
            } else {
              stateClass = "bg-rose-400 border-rose-600";
              scale = 0.9;
            }
          }

          return (
            <motion.button
              key={`${question.id}-${i}`}
              onClick={() => handleItemClick(i)}
              disabled={!isActive || answeredIndex !== null}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isActive ? scale : 0.8, 
                opacity: 1,
                rotate: isSelected && !isCorrect ? [0, -10, 10, -10, 10, 0] : 0
              }}
              transition={{ 
                delay: i * 0.05, 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }}
              whileHover={isActive && answeredIndex === null ? { scale: 1.1, rotate: 5 } : {}}
              whileTap={isActive && answeredIndex === null ? { scale: 0.9 } : {}}
              className={cn(
                "aspect-square rounded-full border-4 flex items-center justify-center text-3xl sm:text-4xl md:text-5xl shadow-lg relative cursor-pointer outline-none select-none touch-manipulation",
              )}
            >
              {getEmoji(i)}
              
              {/* Index number helper for kids */}
              {/* <span className="absolute -bottom-2 text-[10px] font-bold bg-slate-200 px-1.5 rounded-full text-slate-500">
                {i + 1}
              </span> */}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
