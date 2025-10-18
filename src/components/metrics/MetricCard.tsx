'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string;
  comparison?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  comparison,
  icon,
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-red-600'
  };

  const bgClasses = {
    blue: 'bg-blue-500/10',
    green: 'bg-green-500/10',
    purple: 'bg-purple-500/10',
    orange: 'bg-orange-500/10'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 ${className}`}
    >
      {/* Background gradient effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5`} />
      
      {/* Content */}
      <div className="relative z-10">
        {icon && (
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${bgClasses[color]} mb-4`}>
            {icon}
          </div>
        )}
        
        <div className="space-y-2">
          <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
            {value}
          </div>
          
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </div>
          
          {comparison && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {comparison}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;