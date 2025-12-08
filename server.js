const http = require('http');
const app = require('./src/app');
require('dotenv').config();


const PORT = process.env.PORT || 4000;


const server = http.createServer(app);


server.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
});