const Book = require('../models/Book');
const Review = require('../models/Review');
const calculateRating = require('../utils/calculateRating');

exports.getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

exports.addBook = async (req, res) => {
  const { title, author, summary, coverImage  } = req.body;

  const book = await Book.create({
    title,
    author,
    summary,
    addedBy: req.user._id,
    coverImage,
  });

  res.status(201).json(book);
};

exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const reviews = await Review
    .find({ bookId: book._id })
    .populate('userId', 'username');

  res.json({
    ...book.toObject(),
    reviews,
    averageRating: calculateRating(reviews),
  });
};

// 🔥 ADD THIS
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Ownership check
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await book.deleteOne();

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
