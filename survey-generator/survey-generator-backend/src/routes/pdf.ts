import { Router } from 'express';
import { pdfController } from '../controllers/pdfController';

const router = Router();

router.post('/parse', pdfController.parsePdf);
router.post('/extract-scales', pdfController.extractScales);

export default router;