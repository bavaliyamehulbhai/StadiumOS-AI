import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NavigationAI.css';

const BottomSheet = ({ isOpen, onClose, children, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ai-nav-bottom-sheet-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="ai-nav-bottom-sheet"
          >
            <div className="ai-nav-drag-handle" onClick={onClose} style={{ cursor: 'pointer' }} />
            {title && <h2 className="ai-nav-title">{title}</h2>}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
