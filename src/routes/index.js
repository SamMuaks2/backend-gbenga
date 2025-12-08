const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
res.json({ message: 'Welcome to the API', timestamp: new Date().toISOString() });
});


router.use('/auth', require('./auth'));


const { authMiddleware } = require('../middleware/authMiddleware');
router.get('/protected', authMiddleware, (req, res) => {
res.json({ message: 'Protected route', user: req.user });
});


module.exports = router;