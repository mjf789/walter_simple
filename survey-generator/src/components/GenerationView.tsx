import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import GlassButton from './ui/GlassButton';
import LoadingSpinner from './ui/LoadingSpinner';
import { generateTXT, downloadTXT } from '../services/api';

interface GenerationViewProps {
  extractedData: any;
  onBack: () => void;
  onComplete: () => void;
}

const GenerationView: React.FC<GenerationViewProps> = ({
  extractedData,
  onBack,
  onComplete
}) => {
  const [loading, setLoading] = useState(false);
  const [txtPreview, setTxtPreview] = useState<string | null>(null);

  const handleGenerateTXT = async () => {
    try {
      setLoading(true);
      const response = await generateTXT(extractedData);
      setTxtPreview(response.txtContent);
    } catch (error) {
      console.error('Error generating TXT:', error);
      alert('Failed to generate TXT format. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTXT = async () => {
    try {
      setLoading(true);
      await downloadTXT(extractedData);
    } catch (error) {
      console.error('Error downloading TXT:', error);
      alert('Failed to download TXT file. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <h2 className="text-4xl font-bold text-center mb-8 tracking-tight">Survey Preview</h2>

      <GlassCard className="mb-8">
        <h3 className="text-2xl font-semibold mb-6">{extractedData.scaleName}</h3>
        
        <div className="mb-8 space-y-2">
          <p className="text-text-secondary">
            <span className="font-medium text-text-primary">Items:</span> {extractedData.items.length}
          </p>
          {extractedData.instructions && (
            <div className="mt-4 p-4 bg-glass-light rounded-xl border border-glass-border">
              <p className="text-sm font-medium text-text-primary mb-1">Instructions</p>
              <p className="text-sm text-text-secondary">
                {extractedData.instructions}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {extractedData.items.map((item: any, index: number) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-glass-light rounded-xl border border-glass-border
                         hover:bg-glass-medium hover:border-accent-blue/20 
                         transition-all duration-200"
            >
              <p className="text-sm font-semibold text-accent-blue mb-2">
                Question {index + 1}
              </p>
              <p className="text-base text-text-primary leading-relaxed">{item.question}</p>
              {item.responseType === 'likert' && item.scaleRange && (
                <p className="text-sm text-text-secondary mt-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-blue/50"></span>
                    Likert scale: {item.scaleRange.min} to {item.scaleRange.max}
                  </span>
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {!txtPreview && (
          <div className="mt-6 flex justify-center">
            <GlassButton
              onClick={handleGenerateTXT}
              disabled={loading}
              className="px-6"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Generate TXT Format'}
            </GlassButton>
          </div>
        )}

        {txtPreview && (
          <div className="mt-8 space-y-4">
            <div className="p-6 bg-glass-light border border-glass-border rounded-xl">
              <h4 className="text-base font-semibold mb-3 text-text-primary">TXT Format Preview</h4>
              <pre className="text-sm font-mono whitespace-pre-wrap text-text-secondary 
                             max-h-64 overflow-y-auto bg-bg-primary/50 p-4 rounded-lg
                             border border-glass-border">
                {txtPreview}
              </pre>
            </div>
            
            <div className="flex justify-center">
              <GlassButton
                onClick={handleDownloadTXT}
                disabled={loading}
                variant="primary"
                className="px-6"
              >
                {loading ? <LoadingSpinner size="small" /> : 'Download TXT File'}
              </GlassButton>
            </div>
          </div>
        )}
      </GlassCard>

      <div className="flex justify-between">
        <GlassButton
          onClick={onBack}
          variant="secondary"
        >
          Back
        </GlassButton>

        <GlassButton
          onClick={onComplete}
          variant="secondary"
        >
          Start New
        </GlassButton>
      </div>
    </motion.div>
  );
};

export default GenerationView;