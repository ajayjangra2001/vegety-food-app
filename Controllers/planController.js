const Plan = require('../Models/planModel');

module.exports.createPlan = async function createPlan(req, res) {

    try {

        if (req.cookies.$food_app_login$) {

            if (req.cookies.$food_app_login$.userData.role === 'Admin') {

            
                const plan = await Plan.create(req.body);

                res.json({
                    message : 'Plan Created Successfully',
                    data : plan
                })

            } else {
                return res.json({
                    message : 'You are not an authorised person to perform this operation'
                })
            }

        } else {
            return res.json({
                message : 'Please Logged In First'
            })
        }
        
    } catch (error) {
        return res.json({
            message : 'An Error Occurred'
        })
    }

}


module.exports.getAllPlans = async function getAllPlans(req, res) {

    try {

        const allPlans = await Plan.find();

        if (allPlans) return res.json({
            message : 'All Plans Retrieved',
            data : [...allPlans]
        })
        else return res.json({
            message : 'No Plan Found'
        })
        
    } catch (error) {
        return res.json({
            message : 'An Error Occurred'
        })
    }
}

module.exports.getPlan = async function getPlan(req, res) {

    try {

        const { id } = req.params;

        if (id) {
            const plan = await Plan.findById(id);

            if (plan) return res.json({
                message : 'Plan Retrieved',
                data : plan
            }) 
            else return res.json({
                message : 'No Plan Found'
            })

        } else {
            return res.json({
                message : 'Something went wrong!!'
            })
        }
        
    } catch (error) {
        return res.json({
            message : 'An Error Occurred'
        })
    }

}


module.exports.top3Plans = async function top3Plans(req, res) {

    try {

        const plans = await Plan.find().sort({
            ratingsAverage : -1
        }).limit(3);

        if(plans) {
            return res.json({
                message : 'Plans retrieved',
                data : plans
            })
        } else {
            return res.json({
                message : 'No Plans found'
            })
        }
        
    } catch (error) {
        return res.json({
            message : 'An Error Occurred'
        })
    }

}