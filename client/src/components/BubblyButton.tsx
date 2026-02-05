import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BubblyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export function BubblyButton({ 
  className, 
  variant = 'primary', 
  size = 'md',
  children, 
  ...props 
}: BubblyButtonProps) {
  
  const variants = {
    primary: "bg-violet-500 hover:bg-violet-400 text-white border-violet-700",
    secondary: "bg-sky-400 hover:bg-sky-300 text-white border-sky-600",
    danger: "bg-rose-400 hover:bg-rose-300 text-white border-rose-600",
    success: "bg-green-400 hover:bg-green-300 text-white border-green-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-2xl",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "font-display font-bold rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all duration-75 shadow-lg",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
