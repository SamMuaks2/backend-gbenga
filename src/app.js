const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
// const devotionalRoutes = require("./routes/devotionals.routes");
const path = require("path");
const fs = require("fs");
const mime = require("mime-types");
const { notFound, errorHandler } = require('./middleware/errorHandler');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();

// Connect to DB
connectDB().catch(err => {
  console.error('DB connection failed:', err.message);
  process.exit(1);
});

// Create uploads directory if it doesn't exist
// const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('📁 Created uploads directory at:', UPLOAD_DIR);
}

// Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:3000", "http://localhost:4000", "http://localhost:3001", "https://gbengaomole.com", "https://www.gbengaomole.com"],
      },
    },
  })
);

// CORS: Allow requests from frontend
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "https://gbengaomole.com", "https://www.gbengaomole.com"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serving static files BEFORE routes
app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    setHeaders: (res, filePath) => {
      const mimeType = mime.lookup(filePath);
      if (mimeType) {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin", "Content-Type", mimeType);
      }
      // Add CORS headers for images
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

// Log when uploads directory is accessed
app.use("/uploads", (req, res, next) => {
  console.log(`📸 Accessing upload: ${req.path}`);
  next();
});

// app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/books", require("./routes/books.routes"));
app.use("/api/devotionals", require("./routes/devotionals.routes"));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uploadsDir: UPLOAD_DIR,
    uploadsDirExists: fs.existsSync(UPLOAD_DIR)
  });
});

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;