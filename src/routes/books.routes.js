const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createBook,
  getBooks,
  getFeaturedBooks,
  updateBook,
  deleteBook,
} = require("../controllers/books.controller");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}${ext}`);
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// const upload = require("../middleware/upload");

router.post("/", upload.single("cover"), createBook);
router.get("/", getBooks);
router.get("/featured", getFeaturedBooks);
router.put("/:id", upload.single("cover"), updateBook);
router.delete("/:id", deleteBook);

module.exports = router;


// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const {
//   createBook,
//   getBooks,
//   getFeaturedBooks,
//   updateBook,
//   deleteBook,
// } = require("../controllers/books.controller");

// const router = express.Router();

// // ✅ Absolute uploads directory (CRITICAL)
// const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// // ✅ Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, UPLOAD_DIR);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}${ext}`);
//   },
// });

// // ✅ Single, correct upload instance
// const upload = multer({ storage });

// // ✅ Routes
// router.post("/", upload.single("cover"), createBook);
// router.get("/", getBooks);
// router.get("/featured", getFeaturedBooks);
// router.put("/:id", upload.single("cover"), updateBook);
// router.delete("/:id", deleteBook);

// module.exports = router;
