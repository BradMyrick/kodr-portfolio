'use client';

import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showLineNumbers = false,
  className = ''
}) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const lines = code.split('\n');

  return (
    <div className={`relative overflow-hidden rounded-lg bg-gray-900 dark:bg-gray-950 ${className}`}>
      <div className="overflow-x-auto">
        <pre
          className={`language-${language} m-0 p-4 ${showLineNumbers ? 'pl-12' : ''}`}
          suppressHydrationWarning
        >
          {showLineNumbers && (
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-800/50 dark:bg-gray-900/50 border-r border-gray-800">
              {lines.map((_, index) => (
                <div
                  key={index}
                  className="px-2 text-right text-xs text-gray-500 leading-6"
                  style={{ height: '1.5rem' }}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          <code
            ref={codeRef}
            className={`language-${language} text-sm`}
            style={{ tabSize: 2 }}
            suppressHydrationWarning
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
