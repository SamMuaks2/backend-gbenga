const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
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


// Middlewares
// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:3000", "http://localhost:4000"],
      },
    },
  })
);

app.use(cors());

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001",]

}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));


// Routes
// app.use('/api', routes);
// app.use("/uploads", express.static("uploads"));

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}


app.use(
  "/uploads",
//   express.static(path.join(__dirname, "uploads"), {
  express.static(path.join(UPLOAD_DIR), {
    setHeaders: (res, filePath) => {
      const mimeType = mime.lookup(filePath);
      if (mimeType) res.setHeader("Content-Type", mimeType);
      
    },
  })
);
app.use("/api/books", require("./routes/books.routes"));



// 404 + error handlers
app.use(notFound);
app.use(errorHandler);


module.exports = app;