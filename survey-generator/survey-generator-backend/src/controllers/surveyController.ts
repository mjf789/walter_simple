import { Request, Response } from 'express';
import qsfService from '../services/qsfService';

export const surveyController = {
  generateQSF: async (req: Request, res: Response) => {
    try {
      const { surveyData } = req.body;
      
      if (!surveyData) {
        res.status(400).json({ error: 'No survey data provided' });
        return;
      }

      const { scaleName, items, instructions } = surveyData;
      
      if (!scaleName || !items || items.length === 0) {
        res.status(400).json({ error: 'Invalid survey data' });
        return;
      }

      // Generate QSF
      const qsfData = qsfService.generateQSF(scaleName, items, instructions);
      
      // Validate QSF
      const validation = qsfService.validateQSF(qsfData);
      if (!validation.valid) {
        res.status(400).json({ 
          error: 'Invalid QSF generated', 
          validationErrors: validation.errors 
        });
        return;
      }

      res.json({
        success: true,
        qsfData,
        surveyId: qsfData.SurveyEntry.SurveyID
      });
    } catch (error) {
      console.error('QSF generation error:', error);
      res.status(500).json({ error: 'Failed to generate QSF' });
    }
  },

  downloadQSF: async (req: Request, res: Response) => {
    try {
      const { qsfData } = req.body;
      
      if (!qsfData) {
        res.status(400).json({ error: 'No QSF data provided' });
        return;
      }

      const qsfContent = qsfService.exportToFile(qsfData);
      const filename = `survey_${qsfData.SurveyEntry.SurveyID}.qsf`;

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(qsfContent);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Failed to download QSF' });
    }
  }
};