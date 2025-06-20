import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadPDF = async (file: File) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const extractScales = async (pdfText: string, scaleDescription: string) => {
  const response = await api.post('/pdf/extract-scales', {
    text: pdfText,
    scaleDescription,
  });

  return response.data;
};

export const generateQSF = async (surveyData: any) => {
  const response = await api.post('/survey/generate-qsf', {
    surveyData,
  });

  return response.data;
};

export const downloadQSF = async (qsfData: any) => {
  const response = await api.post('/survey/download/1', { qsfData }, {
    responseType: 'blob',
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `survey_${Date.now()}.qsf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default api;