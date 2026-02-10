const Review = require('../models/Review');

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;

  const review = await Review.create({
    bookId: req.params.id,
    userId: req.user._id,
    rating,
    comment,
  });

  res.status(201).json(review);
};
