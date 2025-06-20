import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import './App.css';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'generation'>('upload');

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    setCurrentStep('processing');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent" />
      
      {currentStep === 'upload' && (
        <FileUpload onFilesSelected={handleFilesSelected} />
      )}
      
      {currentStep === 'processing' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Processing files...</h2>
          <p className="text-text-secondary">This is where processing will happen</p>
        </div>
      )}
    </div>
  );
}

export default App;
