import React from 'react';

interface ResultDisplayProps {
  result: string;
}

const formatResult = (result: string) => {
  const sentences = result.split('. ').filter((sentence) => sentence.trim() !== '');
  return sentences.map((sentence, index) => (
    <p key={index} className="mb-4 text-lg text-gray-700">
      {sentence.trim().endsWith('.') ? sentence : `${sentence}.`}
    </p>
  ));
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 py-6 mb-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Recommendation</h2>
      <div className="space-y-2">{formatResult(result)}</div>
    </div>
  );
};

export default ResultDisplay;
