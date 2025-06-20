import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from './ui/GlassCard';
import GlassButton from './ui/GlassButton';
import LoadingSpinner from './ui/LoadingSpinner';
import { generateQSF, downloadQSF } from '../services/api';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [qsfData, setQsfData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateQSF(extractedData);
      
      if (response.success) {
        setQsfData(response.qsfData);
      }
    } catch (err) {
      setError('Failed to generate QSF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (qsfData) {
      try {
        await downloadQSF(qsfData);
      } catch (err) {
        setError('Failed to download file.');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <h2 className="text-3xl font-bold text-center mb-8">Generate QSF Survey</h2>

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

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {qsfData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
          >
            <p className="text-green-400 font-medium mb-2">QSF Generated Successfully!</p>
            <p className="text-sm text-text-secondary">
              Survey ID: {qsfData.SurveyEntry.SurveyID}
            </p>
          </motion.div>
        )}
      </GlassCard>

      <div className="flex justify-between">
        <GlassButton
          onClick={onBack}
          variant="secondary"
          disabled={isGenerating}
        >
          Back
        </GlassButton>

        <div className="flex gap-3">
          {!qsfData && (
            <GlassButton
              onClick={handleGenerate}
              variant="primary"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                'Generate QSF'
              )}
            </GlassButton>
          )}

          {qsfData && (
            <>
              <GlassButton
                onClick={handleDownload}
                variant="primary"
              >
                Download QSF
              </GlassButton>
              <GlassButton
                onClick={onComplete}
                variant="secondary"
              >
                Start New
              </GlassButton>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GenerationView;