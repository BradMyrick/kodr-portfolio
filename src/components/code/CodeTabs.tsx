'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeBlock from './CodeBlock';

interface CodeTab {
  language: string;
  label: string;
  code: string;
  icon?: string;
}

interface CodeTabsProps {
  tabs: CodeTab[];
  defaultTab?: number;
  className?: string;
}

const CodeTabs: React.FC<CodeTabsProps> = ({ tabs, defaultTab = 0, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const languageColors: Record<string, string> = {
    rust: 'from-orange-500 to-red-600',
    go: 'from-cyan-500 to-blue-600',
    python: 'from-yellow-500 to-green-600',
    javascript: 'from-yellow-400 to-yellow-600',
    typescript: 'from-blue-500 to-blue-700',
  };

  return (
    <div className={`rounded-xl overflow-hidden bg-gray-900 dark:bg-gray-950 border border-gray-800 ${className}`}>
      {/* Tab Headers */}
      <div className="flex overflow-x-auto bg-gray-800/50 dark:bg-gray-900/50 border-b border-gray-800">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`
              relative px-6 py-3 text-sm font-medium transition-all duration-200
              ${activeTab === index
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-300'
              }
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              {tab.label}
            </span>
            {activeTab === index && (
              <motion.div
                layoutId="activeTab"
                className={`absolute inset-0 bg-gradient-to-r ${languageColors[tab.language] || 'from-purple-500 to-blue-600'} opacity-20`}
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {activeTab === index && (
              <motion.div
                layoutId="activeTabBorder"
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${languageColors[tab.language] || 'from-purple-500 to-blue-600'}`}
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Code Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <CodeBlock
            code={tabs[activeTab].code}
            language={tabs[activeTab].language}
            showLineNumbers={true}
            className="rounded-none border-0"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CodeTabs;
