const jwt = require("jsonwebtoken");
const { User } = require('../Models/userModel');


module.exports.protectRoute = async function protectRoute(req, res, next) {

    try {
    let token;
    if (req.cookies.$food_app_login$) {
        token = req.cookies.$food_app_login$.jwt_token;

        let payload = jwt.verify(token, process.env.JWT_KEY);
        if (payload) {
            const user = await User.findById(payload.payload);
            console.log("User", user);
            // req.body.role = user.role;
            req.body.id = user._id.toString();
            console.log(req.body)
            next();
        }
        else {
            const client = req.get('User-Agent');
            if (client.includes('mozilla')) {
              return res.redirect('/login');
            }
            return res.json({
                message : 'Please login again'
            })
        }
    } else {
      res.json({
        message : 'Please Login'
      })
    }
}
    catch (error) {
        return res.json({
            message : error.message
        })
    }
}