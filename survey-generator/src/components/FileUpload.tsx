import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import GlassCard from './ui/GlassCard';
import GlassButton from './ui/GlassButton';
import Tooltip from './ui/Tooltip';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxFiles: 5
  });

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    onFilesSelected(files);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-text-primary">
        AI Survey Generator
      </h1>
      
      <div className="text-center mb-6">
        <p className="text-text-secondary">
          Upload PDF documents containing survey scales or questionnaires
        </p>
      </div>
      
      <GlassCard className="mb-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 
            ${isDragActive 
              ? 'border-accent-glow bg-accent-blue/10' 
              : 'border-accent-blue/50 hover:border-accent-glow hover:bg-accent-blue/5'
            }`}
        >
          <input {...getInputProps()} />
          <svg
            className="w-16 h-16 mx-auto mb-4 text-accent-blue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg text-text-primary mb-2">
            {isDragActive
              ? 'Drop your PDF files here'
              : 'Drag & drop PDF files here, or click to select'}
          </p>
          <p className="text-sm text-text-secondary">Maximum 5 files</p>
        </div>
      </GlassCard>

      {files.length > 0 && (
        <GlassCard className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Selected Files</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
              >
                <span className="text-text-primary truncate">{file.name}</span>
                <Tooltip content="Remove file">
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  </button>
                </Tooltip>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {files.length > 0 && (
        <div className="flex justify-end">
          <GlassButton onClick={handleNext} variant="primary">
            Next Step
          </GlassButton>
        </div>
      )}
    </div>
  );
};

export default FileUpload;