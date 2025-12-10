// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "cover") {
//       cb(null, "uploads/covers");
//     } else {
//       cb(null, "uploads/devotionals");
//     }
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}-${Date.now()}${ext}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.fieldname === "cover") {
//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Cover must be an image"), false);
//     }
//   }

//   if (file.fieldname === "file") {
//     const allowed = [
//       "application/pdf",
//       "text/plain",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ];
//     if (!allowed.includes(file.mimetype)) {
//       return cb(new Error("Invalid devotional file type"), false);
//     }
//   }

//   cb(null, true);
// };

// module.exports = multer({ storage, fileFilter });

const multer = require("multer");
const path = require("path");
const fs = require("fs");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/devotionals";

    if (file.fieldname === "cover") {
      uploadPath = "uploads/covers";
    }

    // ✅ ENSURE DIRECTORY EXISTS
    ensureDir(uploadPath);

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_");

    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "cover") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Cover must be an image"), false);
    }
  }

  if (file.fieldname === "file") {
    const allowed = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Invalid devotional file type"), false);
    }
  }

  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
