const stripe = require('stripe')(process.env.SECURITY_KEY);
const {User} = require('../Models/userModel');


module.exports.createSession = async function createSession(req, res) {
    try {

        const { planDetails, token } = req.body;

        const { userData } = req.cookies.$food_app_login$;

        const customer = await stripe.customers.create({
            email: token.email,
            source : token.id,
        });

        const charges = await stripe.charges.create({
            amount : planDetails.price * 100,
            currency : 'inr',
            customer : customer.id,
            receipt_email : token.email,
            description : planDetails.name
        })

        if (charges) {

            userData["plan"] = planDetails._id;
            console.log(userData);
            await User.findByIdAndUpdate(userData._id, userData);

            res.json({
                message : 'Plan successfully added',
            })
        } else {
            res.json({
                message : "An error occurred"
            })
        }

    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}



