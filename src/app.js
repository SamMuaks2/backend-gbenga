const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
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
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));


// Routes
app.use('/api', routes);


// 404 + error handlers
app.use(notFound);
app.use(errorHandler);


module.exports = app;