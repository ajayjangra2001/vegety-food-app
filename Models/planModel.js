const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        max : [20, 'Plan Name should not be exceed more than 20 characters']
    },

    duration : {
        type : Number,
        required : true
    },

    description : {
        type : String,
        min : 10,
        required : true
    },

    price : {
        type : Number,
        required : [true, 'Price not entered']
    },

    ratingsAverage : {
        type : Number,
        default : 0
    },

    discount : {
        type : Number,
        validate : [function() {
            return this.discount < 100;
        }, 'Discount should not exceed price']
    }

})

const Plan = mongoose.model('planModel', planSchema);

module.exports = Plan;