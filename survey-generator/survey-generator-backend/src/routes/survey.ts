import { Router } from 'express';
import { surveyController } from '../controllers/surveyController';

const router = Router();

// TXT generation routes
router.post('/generate-txt', surveyController.generateTXT);
router.post('/download-txt', surveyController.downloadTXT);

export default router;