import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const PageLoader = ({ text = "Loading StadiumOS..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="w-12 h-12 text-blue-600" />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-gray-500 font-medium"
      >
        {text}
      </motion.p>
    </div>
  );
};

export default PageLoader;
