import { Router } from 'express';
import multer from 'multer';
import { uploadController } from '../controllers/uploadController';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Add middleware to log incoming requests
router.use((req, res, next) => {
  console.log('[Upload Route] Incoming request to:', req.path);
  console.log('[Upload Route] Method:', req.method);
  console.log('[Upload Route] Content-Type:', req.headers['content-type']);
  next();
});

router.post('/', upload.single('pdf'), (req, res, next) => {
  console.log('[Upload Route] Post request to / received');
  console.log('[Upload Route] After multer - file exists:', !!req.file);
  next();
}, uploadController.handlePdfUpload);

router.post('/multiple', upload.array('pdfs', 5), uploadController.handleMultiplePdfUpload);

export default router;