import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ProcessingView from './components/ProcessingView';
import GenerationView from './components/GenerationView';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { uploadPDF } from './services/api';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'generation'>('upload');
  const [pdfText, setPdfText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const response = await uploadPDF(files[0]);
      
      if (response.success) {
        setPdfText(response.pdfText);
        setFileName(files[0].name);
        setCurrentStep('processing');
      }
    } catch (err) {
      setError('Failed to upload and parse PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExtractionComplete = (data: any) => {
    setExtractedData(data);
    setCurrentStep('generation');
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setPdfText('');
    setFileName('');
    setExtractedData(null);
    setError(null);
  };

  const handleBackToProcessing = () => {
    setCurrentStep('processing');
    setExtractedData(null);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent" />
        
        {isUploading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-bg-primary p-8 rounded-xl">
              <LoadingSpinner size="large" />
              <p className="text-text-secondary mt-4">Uploading and parsing PDF...</p>
            </div>
          </div>
        )}
        
        {currentStep === 'upload' && (
          <FileUpload onFilesSelected={handleFilesSelected} />
        )}
        
        {currentStep === 'processing' && (
          <ProcessingView
            pdfText={pdfText}
            fileName={fileName}
            onComplete={handleExtractionComplete}
            onBack={handleReset}
          />
        )}
        
        {currentStep === 'generation' && extractedData && (
          <GenerationView
            extractedData={extractedData}
            onBack={handleBackToProcessing}
            onComplete={handleReset}
          />
        )}
        
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500/20 
                          rounded-lg p-4 max-w-md">
            <p className="text-red-400">{error}</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
