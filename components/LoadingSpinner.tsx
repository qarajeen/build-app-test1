import React, { useState, useEffect } from 'react';

const messages = [
  "Scanning page for images...",
  "Analyzing image compression...",
  "Checking for modern formats...",
  "Evaluating SEO and accessibility...",
  "Compiling your report...",
];

const LoadingSpinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="mt-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 border-4 border-cyan-500 border-dashed rounded-full animate-spin"></div>
      <h2 className="mt-6 text-2xl font-semibold text-slate-200">AI is Analyzing Your Page...</h2>
      <p className="mt-2 text-slate-400 h-6 transition-opacity duration-300">
        {messages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingSpinner;
