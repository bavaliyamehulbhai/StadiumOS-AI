import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveCounter = ({ value, prefix = "", suffix = "" }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevValue(value);
      }, 500); // 500ms transition
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div className="relative inline-flex items-center overflow-hidden h-[40px]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
          className={`text-3xl font-bold text-gray-900 ${isAnimating ? 'text-indigo-600 scale-110' : ''} transition-all duration-300`}
        >
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default LiveCounter;
