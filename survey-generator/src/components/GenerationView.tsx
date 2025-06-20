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
      <h2 className="text-3xl font-bold text-center mb-8">Survey Preview</h2>

      <GlassCard className="mb-6">
        <h3 className="text-xl font-semibold mb-4">{extractedData.scaleName}</h3>
        
        <div className="mb-6">
          <p className="text-text-secondary mb-2">Number of items: {extractedData.items.length}</p>
          {extractedData.instructions && (
            <p className="text-sm text-text-secondary italic">
              Instructions: {extractedData.instructions}
            </p>
          )}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {extractedData.items.map((item: any, index: number) => (
            <div key={index} className="p-3 bg-white/5 rounded-lg">
              <p className="text-sm font-medium mb-1">Item {index + 1}</p>
              <p className="text-sm">{item.question}</p>
              {item.responseType === 'likert' && item.scaleRange && (
                <p className="text-xs text-text-secondary mt-1">
                  Scale: {item.scaleRange.min} - {item.scaleRange.max}
                </p>
              )}
            </div>
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
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="text-sm font-medium mb-2 text-text-secondary">TXT Preview:</h4>
              <pre className="text-xs whitespace-pre-wrap text-text-secondary max-h-48 overflow-y-auto">
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