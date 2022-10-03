const express = require('express');
const userRouter = express.Router();
const { signup , verifyUser, login, logout, forgotPassword, updatePassword, updateUser, updateProfilePic, getUserProfile} = require('../Controllers/userController');
const path = require('path');
const multer = require('multer');


const destination = path.join(path.join(path.resolve(__dirname, '..'), 'Uploads'), '/');

const multerStorage = multer.diskStorage({
    destination : function(req, file, cb) {
      cb(null, destination);
    },
    filename : function(req, file, cb) {
      cb(null, `image-${file.originalname}-${Date.now()}`);
    }
})
  
const filter = function (req, file, cb) {
    if(file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Not an Image! Please upload an image'), false);
    }
}
  
const upload = multer({
    storage : multerStorage,
    fileFilter : filter
})


userRouter
.route('/signup')
.post(signup)

userRouter
.route('/verify/:id/:token')
.get(verifyUser)

userRouter
.route('/forgotPassword/:id/:token/updatePassword')
.patch(updatePassword)

userRouter
.route('/login')
.post(login)

userRouter
.route('/update/:id')
.patch(updateUser)

userRouter
.post('/profile/:id', upload.single('user_image'), updateProfilePic);

userRouter
.route('/userProfile/:id')
.get(getUserProfile)

userRouter
.route('/forgotPassword')
.post(forgotPassword)

userRouter
.route('/logout')
.get(logout)


module.exports = userRouter;