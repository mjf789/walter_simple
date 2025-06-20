import { Router } from 'express';
import { surveyController } from '../controllers/surveyController';

const router = Router();

router.post('/generate-qsf', surveyController.generateQSF);
router.post('/download/:id', surveyController.downloadQSF);

export default router;