import { ReactNode } from "react";
import { motion } from "motion/react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, message, action, className = "" }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-200 rounded-[2rem] bg-gray-50/50 ${className}`}
    >
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-sm border border-gray-100">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {message && <p className="text-sm text-gray-500 mt-2 max-w-sm">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
