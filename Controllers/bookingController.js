const stripe = require('stripe')(process.env.SECURITY_KEY);
const Plan = require('../models/planModel');
const {User} = require('../models/userModel');

module.exports.createSession = async function createSession(req, res) {
    try {
        let userId = req.params.id;
        let planId = req.params.id;

        const user = await User.findById(userId);
        const plan = await Plan.findById(planId);

        const session = await stripe.checkout.session.create({
            payment_method_type : ['card'],
            customer_email : user.email,
            client_reference_id : plan._id,
            list_items : [
                {
                    name : plan.name,
                    description : plan.description,
                    amound : plan.price*100,
                    currency : 'inr',
                    quantity : 1
                }
            ],
            success_url: `${req.protocol}://${req.get('host')}/profile`,
            cancel_url: `${req.protocol}://${req.get('host')}/profile`,
        }) 

        res.status(200).json({
            status : 'success',
            session
        })


    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}



