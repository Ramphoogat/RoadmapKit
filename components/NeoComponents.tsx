import React from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NeoButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 px-6 py-3 font-bold border-2 border-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none uppercase tracking-wide text-sm";
  
  const variants = {
    primary: "bg-neo-pink text-white shadow-neo hover:bg-red-500",
    secondary: "bg-neo-white text-black shadow-neo hover:bg-gray-50",
    accent: "bg-neo-yellow text-black shadow-neo hover:bg-yellow-400",
    danger: "bg-black text-white shadow-neo hover:bg-gray-800",
    ghost: "bg-transparent text-black border-2 border-transparent hover:border-black hover:bg-neo-offwhite shadow-none",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

export const NeoCard: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ 
  children, 
  className = '',
  title
}) => {
  return (
    <div className={`bg-white border-2 border-black shadow-neo p-4 ${className}`}>
      {title && (
        <div className="border-b-2 border-black pb-2 mb-4 flex justify-between items-center">
          <h3 className="text-lg font-bold uppercase tracking-wide">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export const NeoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`bg-neo-offwhite border-2 border-black shadow-neo-xl w-full ${maxWidth} relative overflow-hidden flex flex-col max-h-[90vh]`}
          >
            <div className="flex justify-between items-center p-4 border-b-2 border-black bg-neo-yellow shrink-0">
              <h3 className="font-bold text-xl uppercase tracking-wider">{title}</h3>
              <button 
                onClick={onClose} 
                className="hover:bg-black hover:text-white border-2 border-transparent hover:border-black p-1 transition-colors rounded-none"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const NeoInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className="w-full p-3 font-medium border-2 border-black focus:outline-none focus:shadow-neo transition-shadow bg-white placeholder-gray-500"
    {...props}
  />
);

export const NeoTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    className="w-full p-3 font-medium border-2 border-black focus:outline-none focus:shadow-neo transition-shadow bg-white resize-none h-32 placeholder-gray-500"
    {...props}
  />
);

export const NeoSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <div className="relative">
    <select
      className="w-full p-3 font-bold border-2 border-black focus:outline-none focus:shadow-neo transition-shadow bg-white appearance-none cursor-pointer"
      {...props}
    >
      {props.children}
    </select>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
      ▼
    </div>
  </div>
);