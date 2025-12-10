const Book = require("../models/Book");

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

// CREATE
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create({
      ...req.body,
      coverImage: req.file ? `${BASE_URL}/uploads/${req.file.filename}` : null,
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ (ALL)
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ (FEATURED)
exports.getFeaturedBooks = async (req, res) => {
  try {
    const books = await Book.find({ isFeatured: true }).limit(6);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateBook = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      
      ...(req.file && { coverImage: `${BASE_URL}/uploads/${req.file.filename}` }),
    };

    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};