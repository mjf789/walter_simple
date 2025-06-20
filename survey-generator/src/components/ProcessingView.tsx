import React, { useState } from 'react';
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
      <h2 className="text-4xl font-bold text-center mb-8 tracking-tight">Extract Survey Scales</h2>

      <GlassCard className="mb-6">
        <div className="mb-6 p-4 bg-glass-light rounded-xl border border-glass-border">
          <p className="text-sm text-text-secondary mb-1">Processing file</p>
          <p className="text-lg font-semibold text-text-primary">{fileName}</p>
        </div>

        {step === 'input' && (
          <div>
            <label className="block text-base font-medium mb-3 text-text-primary">
              Describe the scale or measure you want to extract:
            </label>
            <textarea
              value={scaleDescription}
              onChange={(e) => setScaleDescription(e.target.value)}
              placeholder="e.g., 'Beck Depression Inventory' or 'Self-efficacy scale with 10 items'"
              className="w-full p-4 rounded-xl bg-glass-light border border-glass-border 
                       focus:border-accent-glow focus:outline-none focus:ring-2 
                       focus:ring-accent-blue/50 text-text-primary placeholder-text-tertiary
                       min-h-[120px] transition-all duration-200
                       hover:bg-glass-medium focus:bg-glass-medium"
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