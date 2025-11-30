import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const maxSize = 100 * 1024 * 1024; // 100MB

  // Check file size
  if (file.size > maxSize) {
    cb(new Error('File too large. Maximum size is 100MB.'), false);
    return;
  }

  // Log for easy debugging (you'll see this in docker logs)
  console.log(`Uploading: ${file.originalname} (${file.mimetype})`);

  // Accept ALL file types - full support for images, videos, documents, zip, etc.
  // This includes your PNG screenshot, PDFs, MP4, ZIP, DOCX, TXT, JSON, and everything else
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: fileFilter
});
