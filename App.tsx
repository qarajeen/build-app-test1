
import React, { useState } from 'react';
import type { AnalysisReport } from './types';
import { analyzeUrl } from './services/geminiService';
import URLInputForm from './components/URLInputForm';
import LoadingSpinner from './components/LoadingSpinner';
import ResultsDisplay from './components/ResultsDisplay';
import CallToAction from './components/CallToAction';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    if (!url) {
      setError('Please enter a valid URL.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const analysisResult = await analyzeUrl(url);
      setResult(analysisResult);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. The URL may be invalid or the AI service is currently unavailable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600 mb-2">
            Website Image Quality Grader
          </h1>
          <p className="text-lg text-slate-400">
            Let AI analyze your webpage's images for performance and quality issues.
          </p>
        </header>

        <main>
          <URLInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />

          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && <LoadingSpinner />}

          {result && !isLoading && (
            <div className="mt-12 animate-fade-in">
              <ResultsDisplay report={result} />
              <CallToAction />
            </div>
          )}
          
          {!isLoading && !result && (
             <div className="mt-12 text-center text-slate-500">
                <div className="max-w-md mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-semibold text-slate-300">Ready to grade your images?</h3>
                    <p className="mt-2">Enter a website URL above to start the analysis. Our AI will check for issues like large file sizes, poor resolution, and missing modern formats that could be slowing down your site.</p>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
