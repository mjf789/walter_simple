import { Request, Response } from 'express';
import pdf from 'pdf-parse';

export const uploadController = {
  handlePdfUpload: async (req: Request, res: Response) => {
    try {
      console.log('[UploadController] Upload request received');
      console.log('[UploadController] Request headers:', req.headers);
      console.log('[UploadController] Request body:', req.body);
      console.log('[UploadController] Request file:', req.file);
      console.log('[UploadController] Request files:', req.files);
      
      if (!req.file) {
        console.log('[UploadController] No file in request - sending 400 error');
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Parse PDF immediately
      const pdfData = await pdf(req.file.buffer);

      const fileInfo = {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        text: pdfData.text,
        numPages: pdfData.numpages,
        info: pdfData.info
      };

      res.json({
        success: true,
        message: 'File uploaded and parsed successfully',
        file: {
          name: fileInfo.filename,
          size: fileInfo.size,
          numPages: fileInfo.numPages,
          textLength: fileInfo.text.length
        },
        pdfText: fileInfo.text
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  },

  handleMultiplePdfUpload: async (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files)) {
        res.status(400).json({ error: 'No files uploaded' });
        return;
      }

      const processedFiles = await Promise.all(
        req.files.map(async (file) => {
          const pdfData = await pdf(file.buffer);
          return {
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            text: pdfData.text,
            numPages: pdfData.numpages
          };
        })
      );

      res.json({
        success: true,
        message: `${processedFiles.length} files uploaded and parsed successfully`,
        files: processedFiles.map(f => ({
          name: f.filename,
          size: f.size,
          numPages: f.numPages,
          textLength: f.text.length
        })),
        pdfTexts: processedFiles.map(f => f.text)
      });
    } catch (error) {
      console.error('Multiple upload error:', error);
      res.status(500).json({ error: 'Multiple upload failed' });
    }
  }
};