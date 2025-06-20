import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
console.log('[API] Base URL configured as:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('[Axios Request]', config.method?.toUpperCase(), config.url);
    console.log('[Axios Request] Headers:', config.headers);
    console.log('[Axios Request] Data:', config.data);
    return config;
  },
  (error) => {
    console.error('[Axios Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('[Axios Response]', response.status, response.config.url);
    console.log('[Axios Response] Data:', response.data);
    return response;
  },
  (error) => {
    console.error('[Axios Response Error]', error.response?.status, error.config?.url);
    console.error('[Axios Response Error] Data:', error.response?.data);
    return Promise.reject(error);
  }
);

export const uploadPDF = async (file: File) => {
  console.log('[API] uploadPDF called with file:', file.name);
  console.log('[API] File size:', file.size, 'bytes');
  console.log('[API] File type:', file.type);
  
  const formData = new FormData();
  formData.append('pdf', file);
  console.log('[API] FormData created with pdf field');

  const uploadUrl = `${API_BASE_URL}/upload`;
  console.log('[API] Upload URL:', uploadUrl);

  try {
    console.log('[API] Making POST request to upload endpoint');
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('[API] Upload response status:', response.status);
    console.log('[API] Upload response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[API] Upload error:', error);
    if (error.response) {
      console.error('[API] Error response status:', error.response.status);
      console.error('[API] Error response data:', error.response.data);
    } else if (error.request) {
      console.error('[API] No response received:', error.request);
    } else {
      console.error('[API] Error setting up request:', error.message);
    }
    throw error;
  }
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