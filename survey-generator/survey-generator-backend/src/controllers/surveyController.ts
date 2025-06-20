import { Request, Response } from 'express';
import txtService from '../services/txtService';

export const surveyController = {
  generateTXT: async (req: Request, res: Response): Promise<void> => {
    try {
      const { surveyData } = req.body;
      
      if (!surveyData) {
        res.status(400).json({ error: 'Survey data is required' });
        return;
      }

      const txtContent = txtService.generateTXT(surveyData);
      
      res.json({
        success: true,
        txtContent,
        message: 'TXT format generated successfully'
      });
    } catch (error) {
      console.error('Error generating TXT:', error);
      res.status(500).json({ 
        error: 'Failed to generate TXT format',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  downloadTXT: async (req: Request, res: Response): Promise<void> => {
    try {
      const { surveyData } = req.body;
      
      if (!surveyData) {
        res.status(400).json({ error: 'Survey data is required' });
        return;
      }

      const txtBuffer = txtService.generateFile(surveyData);
      const fileName = `${surveyData.scaleName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.txt`;
      
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(txtBuffer);
    } catch (error) {
      console.error('Error downloading TXT:', error);
      res.status(500).json({ 
        error: 'Failed to download TXT file',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};