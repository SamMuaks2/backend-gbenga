exports.notFound = (req, res, next) => {
res.status(404).json({ message: 'Not Found' });
};


exports.errorHandler = (err, req, res, next) => {
console.error(err);
const status = err.status || 500;
res.status(status).json({ message: err.message || 'Internal Server Error', stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
};