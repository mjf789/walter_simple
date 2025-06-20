import { Request, Response } from 'express';
import pdf from 'pdf-parse';
import openaiService from '../services/openaiService';

export const pdfController = {
  parsePdf: async (req: Request, res: Response) => {
    try {
      const { pdfBuffer } = req.body;
      
      if (!pdfBuffer) {
        res.status(400).json({ error: 'No PDF data provided' });
        return;
      }

      const data = await pdf(Buffer.from(pdfBuffer, 'base64'));
      
      res.json({
        success: true,
        data: {
          numPages: data.numpages,
          text: data.text,
          info: data.info
        }
      });
    } catch (error) {
      console.error('PDF parsing error:', error);
      res.status(500).json({ error: 'Failed to parse PDF' });
    }
  },

  extractScales: async (req: Request, res: Response) => {
    try {
      const { text, scaleDescription } = req.body;
      
      if (!text || !scaleDescription) {
        res.status(400).json({ error: 'Missing text or scale description' });
        return;
      }

      // Use retry mechanism for AI extraction
      const extractedData = await openaiService.retryWithExponentialBackoff(
        () => openaiService.extractScalesFromText(text, scaleDescription)
      );

      res.json({
        success: true,
        data: extractedData
      });
    } catch (error) {
      console.error('Scale extraction error:', error);
      res.status(500).json({ error: 'Failed to extract scales' });
    }
  }
};