import { motion } from "framer-motion";

interface TimerProps {
  current: number;
  total: number;
}

export function Timer({ current, total }: TimerProps) {
  const percentage = Math.max(0, (current / total) * 100);
  
  // Color transition based on time left
  const getColor = () => {
    if (percentage > 60) return "bg-green-400";
    if (percentage > 30) return "bg-yellow-400";
    return "bg-rose-400";
  };

  return (
    <div className="w-full max-w-md mx-auto h-6 bg-slate-200 rounded-full overflow-hidden border-2 border-slate-300 relative">
      <motion.div
        className={`h-full ${getColor()} transition-colors duration-300`}
        initial={{ width: "100%" }}
        animate={{ width: `${percentage}%` }}
        transition={{ ease: "linear", duration: 0.1 }} // Smooth steps
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-bold text-slate-700 font-display uppercase tracking-widest">
           {Math.ceil(current)}s Time Left
        </span>
      </div>
    </div>
  );
}
