import React from 'react';
import { Bot, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIInsightPanel = ({ aiBrief, criticalIncidents }) => {
  const getIcon = () => {
    if (criticalIncidents > 0) return <AlertTriangle className="w-6 h-6 text-red-500" />;
    if (aiBrief?.toLowerCase().includes('high')) return <Info className="w-6 h-6 text-orange-500" />;
    return <CheckCircle className="w-6 h-6 text-green-500" />;
  };

  const getBgColor = () => {
    if (criticalIncidents > 0) return 'bg-red-50 border-red-200';
    if (aiBrief?.toLowerCase().includes('high')) return 'bg-orange-50 border-orange-200';
    return 'bg-indigo-50 border-indigo-200';
  };

  return (
    <div className={`rounded-xl border p-5 shadow-sm transition-colors duration-500 ${getBgColor()} flex flex-col justify-center h-full`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <Bot className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          AI Executive Brief
        </h3>
      </div>
      
      <div className="flex items-start gap-3 bg-white/60 p-4 rounded-lg border border-white/40">
        <div className="mt-1">
          {getIcon()}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={aiBrief} // Animate when brief changes
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <p className="text-gray-800 font-medium leading-relaxed">
              {aiBrief || "Loading operations data..."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIInsightPanel;
