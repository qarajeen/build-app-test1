
import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <div className="mt-12 bg-gradient-to-r from-cyan-900/50 to-indigo-900/50 border border-cyan-700/50 rounded-xl p-8 text-center shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-3">
        Improve Your Score and Your Site's Speed.
      </h2>
      <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">
        Great images are about more than looks—they're crucial for performance and SEO. Our professional photography services deliver stunning, web-optimized images that load fast and rank high.
      </p>
      <a
        href="#contact"
        className="inline-block bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-md transition duration-150 ease-in-out shadow-md"
      >
        Get a Free Consultation
      </a>
    </div>
  );
};

export default CallToAction;
