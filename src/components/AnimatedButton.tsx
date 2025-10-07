import { motion, TargetAndTransition } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
}

const AnimatedButton = ({ 
  children, 
  className = "", 
  onClick,
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 }
}: AnimatedButtonProps) => {
  return (
    <motion.div
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ duration: 0.2 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedButton;