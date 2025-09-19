
import React, { useState } from 'react';

interface URLInputFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const URLInputForm: React.FC<URLInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAnalyze(url);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="url-input" className="sr-only">
            Website URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://www.example.com/gallery"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-md transition duration-150 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze Images'
          )}
        </button>
      </form>
    </div>
  );
};

export default URLInputForm;
