import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import GlassButton from './ui/GlassButton';
import LoadingSpinner from './ui/LoadingSpinner';
import { extractScales } from '../services/api';

interface ProcessingViewProps {
  pdfText: string;
  fileName: string;
  onComplete: (extractedData: any) => void;
  onBack: () => void;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({
  pdfText,
  fileName,
  onComplete,
  onBack
}) => {
  const [scaleDescription, setScaleDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'processing' | 'complete'>('input');

  const handleExtract = async () => {
    if (!scaleDescription.trim()) {
      setError('Please provide a scale description');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStep('processing');

    try {
      const response = await extractScales(pdfText, scaleDescription);
      
      if (response.success) {
        setStep('complete');
        setTimeout(() => {
          onComplete(response.data);
        }, 1500);
      }
    } catch (err) {
      setError('Failed to extract scales. Please try again.');
      setStep('input');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-center mb-8">Extract Survey Scales</h2>

      <GlassCard className="mb-6">
        <div className="mb-4">
          <p className="text-text-secondary mb-2">Processing file:</p>
          <p className="text-lg font-medium">{fileName}</p>
        </div>

        {step === 'input' && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Describe the scale or measure you want to extract:
            </label>
            <textarea
              value={scaleDescription}
              onChange={(e) => setScaleDescription(e.target.value)}
              placeholder="e.g., 'Beck Depression Inventory' or 'Self-efficacy scale with 10 items'"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 
                       focus:border-accent-glow focus:outline-none focus:ring-2 
                       focus:ring-accent-blue/50 text-white placeholder-text-secondary
                       min-h-[100px]"
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center py-8">
            <LoadingSpinner size="large" />
            <p className="mt-4 text-text-secondary">
              Analyzing PDF and extracting scales...
            </p>
          </div>
        )}

        {step === 'complete' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium">Scales extracted successfully!</p>
          </motion.div>
        )}
      </GlassCard>

      <div className="flex justify-between">
        <GlassButton
          onClick={onBack}
          variant="secondary"
          disabled={isProcessing}
        >
          Back
        </GlassButton>

        {step === 'input' && (
          <GlassButton
            onClick={handleExtract}
            variant="primary"
            disabled={isProcessing || !scaleDescription.trim()}
          >
            Extract Scales
          </GlassButton>
        )}
      </div>
    </motion.div>
  );
};

export default ProcessingView;