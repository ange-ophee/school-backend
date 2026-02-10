const Review = require('../models/Review');

exports.getUserProfile = async (req, res) => {
  const reviews = await Review.find({ userId: req.params.id }).populate('bookId', 'title');
  res.json({ reviews });
};
