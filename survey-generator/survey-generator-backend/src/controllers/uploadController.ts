import { Request, Response } from 'express';

export const uploadController = {
  handlePdfUpload: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const fileInfo = {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer
      };

      res.json({
        success: true,
        message: 'File uploaded successfully',
        file: {
          name: fileInfo.filename,
          size: fileInfo.size
        }
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

      const filesInfo = req.files.map(file => ({
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }));

      res.json({
        success: true,
        message: `${filesInfo.length} files uploaded successfully`,
        files: filesInfo
      });
    } catch (error) {
      console.error('Multiple upload error:', error);
      res.status(500).json({ error: 'Multiple upload failed' });
    }
  }
};