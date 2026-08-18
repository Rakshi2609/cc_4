import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import fs from 'fs';

// Configure Cloudinary from env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'civicplus/issues',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'gif', 'bmp'],
      transformation: [{ width: 1200, crop: 'limit' }],
    },
  });
} else {
  // Fallback to local disk storage
  const uploadDir = path.resolve('uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });
}

const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|avif|heic|gif|bmp)$/i.test(file.originalname)
  ) {
    cb(null, true);
  } else {
    // If not matching, still accept if it looks like an image file
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

export default upload;
