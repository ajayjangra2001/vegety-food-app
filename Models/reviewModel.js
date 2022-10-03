const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    review : {
        type : String,
        required : [true, 'Review is required']
    },
    rating : {
        type : Number,
        min : 1,
        max : 10,
        required : [true, 'Rating is required']
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'userModel',
        required : [true, 'Review must belong to a user']
    },
    plan : {
        type : mongoose.Schema.ObjectId,
        ref : 'planModel',
        required : [true, 'Review must belong to a Plan']
    }
});

// find, findById, findOne
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path : 'user',
        select : 'name profileImage'
    }).populate("plan");

    next();
})

const Review = mongoose.model('reviewModel', reviewSchema);


module.exports = Review;



