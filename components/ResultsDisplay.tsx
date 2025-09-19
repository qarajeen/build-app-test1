import React, { useState, useEffect } from 'react';
import type { AnalysisReport, Finding, FindingType, ImageAnalysis } from '../types';

// --- HELPER COMPONENTS ---

const getScoreColorClasses = (score: number | FindingType) => {
    if (typeof score === 'string') {
        if (score === 'Critical') return { text: 'text-red-400', stroke: 'stroke-red-500', bg: 'bg-red-500', border: 'border-red-700/50' };
        if (score === 'Warning') return { text: 'text-yellow-400', stroke: 'stroke-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-700/50' };
        return { text: 'text-green-400', stroke: 'stroke-green-500', bg: 'bg-green-500', border: 'border-green-700/50' };
    }
    if (score >= 8) return { text: 'text-green-400', stroke: 'stroke-green-500', bg: 'bg-green-500', border: 'border-green-700/50' };
    if (score >= 5) return { text: 'text-yellow-400', stroke: 'stroke-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-700/50' };
    return { text: 'text-red-400', stroke: 'stroke-red-500', bg: 'bg-red-500', border: 'border-red-700/50' };
};

const FindingIcon: React.FC<{type: FindingType}> = ({ type }) => {
    const Icon = {
        Critical: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
        Warning: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        Good: () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }[type];
    const { text } = getScoreColorClasses(type);
    
    return <div className={`w-5 h-5 ${text}`}><Icon /></div>;
};

// --- MAIN UI COMPONENTS ---

const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const { text, stroke } = getScoreColorClasses(score);
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 10) * circumference;

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle className="stroke-slate-700" strokeWidth="10" fill="transparent" r={radius} cx="60" cy="60" />
                <circle
                    className={`${stroke} transition-all duration-1000 ease-out`}
                    strokeWidth="10" strokeLinecap="round" fill="transparent" r={radius} cx="60" cy="60"
                    strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 60 60)"
                />
            </svg>
            <div className={`absolute text-4xl font-bold ${text}`}>
                {score}<span className="text-2xl text-slate-500">/10</span>
            </div>
        </div>
    );
};

const FindingRow: React.FC<{ finding: Finding }> = ({ finding }) => {
    return (
        <div className="py-3">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-1"><FindingIcon type={finding.type} /></div>
                <div className="flex-1">
                    <h4 className="font-semibold text-slate-200">{finding.title}</h4>
                    <p className="mt-1 text-sm text-slate-400">{finding.description}</p>
                    {finding.recommendation && (
                        <div className="mt-2 text-sm text-cyan-300/80">
                           <span className="font-semibold">Recommendation: </span> {finding.recommendation}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const ImageAnalysisCard: React.FC<{ analysis: ImageAnalysis }> = ({ analysis }) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [analysis.src]);

    const isUrl = analysis.src.startsWith('http://') || analysis.src.startsWith('https://');

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg overflow-hidden">
            <div className="p-4 bg-slate-700/50 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-shrink-0 w-24 h-24 bg-slate-800 rounded-md flex items-center justify-center overflow-hidden">
                     {isUrl && !imageError ? (
                        <img 
                            src={analysis.src} 
                            alt={`Analyzed image: ${analysis.src}`}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                        />
                     ) : (
                        <svg className="w-12 h-12 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                     )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-mono text-lg text-cyan-400 break-all">{analysis.src}</h3>
                </div>
            </div>
            <div className="divide-y divide-slate-700/50 px-4">
                {analysis.findings.map((finding, index) => (
                    <FindingRow key={index} finding={finding} />
                ))}
            </div>
        </div>
    );
}


const ResultsDisplay: React.FC<{ report: AnalysisReport }> = ({ report }) => {
    return (
        <div className="space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                        <ScoreGauge score={report.score} />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-100">Analysis Complete</h2>
                        <p className="mt-1 text-lg text-slate-300">{report.summary}</p>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Image-by-Image Breakdown</h2>
                <div className="space-y-6">
                    {report.imageBreakdown.map((analysis, index) => (
                        <ImageAnalysisCard key={index} analysis={analysis} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;