const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const emailValidator = require('email-validator');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name : {
        type : String,
        required : true,
        min : 3,
        max : 255
    }, 

    email : {
        type : String,
        required : true,
        unique : true,
        validate : function() {
            return emailValidator.validate(this.email);
        }
    },

    password : {
        type : String,
        required : true,
        min : 8
    },

    confirmPassword : {
        type : String,
        required : true,
        min : 8,
        validate : function() {
            return this.confirmPassword === this.password;
        }
    },

    role : {
        type : String,
        enum : ['Admin', 'User'],
        default : 'User'
    },

    profileImage : {
        data : Buffer,
        contentType : String
    },

    verified : {
        type : Boolean,
        default : false
    },

    plan : {
        type : mongoose.Schema.ObjectId,
        ref : 'planModel'
    },

    resetToken : String,
    verificationToken : String,
 

})

userSchema.pre('save', function() {
    this.confirmPassword = undefined;
})

userSchema.pre('save', async function() {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
})

const User = mongoose.model('userModel', userSchema);

const validate = (user) => {
    const schema = Joi.object({
        name : Joi.string().min(3).max(255).required(),
        email : Joi.string().email().required(),
        password : Joi.string().min(8).required(),
        confirmPassword : Joi.string().min(8).required()
    });

    return schema.validate(user);
}

module.exports = {
    User,
    validate,
};