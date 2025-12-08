const Joi = require('joi');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const signupSchema = Joi.object({
name: Joi.string().min(2).max(100).required(),
email: Joi.string().email().required(),
password: Joi.string().min(6).required()
});


const loginSchema = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required()
});


exports.signup = async (req, res, next) => {
try {
const { error, value } = signupSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });


const { name, email, password } = value;
const existing = await User.findOne({ email });
if (existing) return res.status(409).json({ message: 'Email already in use' });


const hashed = await bcrypt.hash(password, 10);
const user = new User({ name, email, password: hashed });
await user.save();


const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });


res.status(201).json({ message: 'User created', user: { id: user._id, name: user.name, email: user.email }, token });
} catch (err) {
next(err);
}
};


exports.login = async (req, res, next) => {
try {
const { error, value } = loginSchema.validate(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });


const { email, password } = value;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(401).json({ message: 'Invalid credentials' });


const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });


res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email }, token });
} catch (err) {
next(err);
}
};