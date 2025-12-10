const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createBook,
  getBooks,
  getFeaturedBooks,
  updateBook,
  deleteBook,
} = require("../controllers/books.controller");

const router = express.Router();

// Absolute path to uploads directory (relative to src folder)
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('📁 Created uploads directory at:', UPLOAD_DIR);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    console.log(`📤 Uploading file: ${filename}`);
    cb(null, filename);
  },
});

// File filter (optional but recommended)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
router.post("/", upload.single("cover"), createBook);
router.get("/", getBooks);
router.get("/featured", getFeaturedBooks);
router.put("/:id", upload.single("cover"), updateBook);
router.delete("/:id", deleteBook);

module.exports = router;