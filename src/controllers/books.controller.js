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

// const BASE_URL = "http://localhost:4000";

// exports.createBook = async (req, res) => {
//   const book = await Book.create({
//     ...req.body,
//     coverImage: req.file ? `/uploads/${req.file.filename}` : null,

//     // coverImage: req.file
//     //   ? `${BASE_URL}/uploads/${req.file.filename}`
//     //   : null,
//   });

//   res.status(201).json(book);
// };


// READ (ALL)
exports.getBooks = async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
};

// READ (FEATURED)
exports.getFeaturedBooks = async (req, res) => {
  const books = await Book.find({ isFeatured: true }).limit(6);
  res.json(books);
};

// UPDATE
exports.updateBook = async (req, res) => {
  const updated = await Book.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      ...(req.file && { coverImage: `/uploads/${req.file.filename}` }),
    },
    { new: true }
  );
  res.json(updated);
};

// DELETE
exports.deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
