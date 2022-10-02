const express = require("express");
const reviewRouter = express.Router();

const {
    top10Reviews,
    getPlanReviews,
    createReview,
    updateReview,
    deleteReview
} = require('../Controllers/reviewController');

reviewRouter
.route('/top10')
.get(top10Reviews);

reviewRouter
.route('/:id')
.get(getPlanReviews);

reviewRouter
.route('/create/:planId')
.post(createReview)

reviewRouter
.route('/:id')
.patch(updateReview)
.delete(deleteReview)

module.exports = reviewRouter;






