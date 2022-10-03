const Plan = require("../Models/planModel");
const { User } = require("../Models/userModel");
const Review = require("../Models/reviewModel");

module.exports.getAllUsers = async function getAllUsers(req, res) {
  try {
    let users = await User.find();
    if (users) {
      users = users.filter((user) => {
        return user.role !== "Admin";
      });

      return res.json({
        message: "Users Retrieved",
        data: users,
      });
    } else
      return res.json({
        message: "No User Found",
      });
  } catch (error) {
    return res.json({
      message: "An Error Occurred",
    });
  }
};

module.exports.getAllPlans = async function getAllPlans(req, res) {
  try {
    const plans = await Plan.find();
    if (plans)
      return res.json({
        message: "Plans Retrieved",
        data: plans,
      });
    else
      return res.json({
        message: "No Plan Found",
      });
  } catch (error) {
    return res.json({
      message: "An Error Occurred",
    });
  }
};

module.exports.addPlan = async function addPlan(req, res) {
  try {
    if (req.cookies.$food_app_login$) {
      if (req.cookies.$food_app_login$.userData.role === "Admin") {
        const plan = await Plan.create(req.body);

        res.json({
          message: "Plan Created Successfully",
          data: plan,
        });
      } else {
        return res.json({
          message: "You are not an authorised person to perform this operation",
        });
      }
    } else {
      return res.json({
        message: "Please Logged In First",
      });
    }
  } catch (error) {
    return res.json({
      message: "An Error Occurred",
    });
  }
};

module.exports.deleteUser = async function deleteUser(req, res) {
  try {
    if (req.cookies.$food_app_login$) {
      if (req.cookies.$food_app_login$.userData.role === "Admin") {
        const { id } = req.params;

        let user = await User.findById(id);

        if (user) {

          await Review.deleteMany({ user : user._id });

          await user.remove();

          return res.json({
            message: "Plan Deleted Successfully",
          });
        } else {
          return res.json({
            message: "No Plan Found",
          });
        }
      } else {
        return res.json({
          message: "You are not an authorised person to perform this operation",
        });
      }
    } else {
      return res.json({
        message: "Please Logged In First",
      });
    }
  } catch (error) {
    return res.json({
      message: "An Error Occurred",
    });
  }
};

module.exports.deletePlan = async function deletePlan(req, res) {
  try {
    if (req.cookies.$food_app_login$) {
      if (req.cookies.$food_app_login$.userData.role === "Admin") {
        const { id } = req.params;
        
        const users = await User.find({ plan : id });

        if (users.length !== 0) return res.json({
          message : 'This plan is purchased by users, so you cannot delete now'
        })

        let plan = await Plan.findById(id);

        if (plan) {

          await Review.deleteMany({ plan : plan._id });

          await plan.remove();

          return res.json({
            message: "Plan Deleted Successfully",
          });
        } else {
          return res.json({
            message: "No Plan Found",
          });
        }
      } else {
        return res.json({
          message: "You are not an authorised person to perform this operation",
        });
      }
    } else {
      return res.json({
        message: "Please Logged In First",
      });
    }
  } catch (error) {
    return res.json({
      message: "An Error Occurred",
    });
  }
};

module.exports.updatePlan = async function updatePlan(req, res) {
  try {
    if (req.cookies.$food_app_login$) {
      if (req.cookies.$food_app_login$.userData.role === "Admin") {
        const { id } = req.params;

        let plan = await Plan.findById(id);

        if (plan) {
          plan = { ...plan._doc, ...req.body };

          await Plan.findByIdAndUpdate(plan._id, plan);

          return res.json({
            message: "Plan Updated Successfully",
            data: plan,
          });
        } else {
          return res.json({
            message: "No Plan Found",
          });
        }
      } else {
        return res.json({
          message: "You are not an authorised person to perform this operation",
        });
      }
    } else {
      return res.json({
        message: "Please Logged In First",
      });
    }
  } catch (error) {
    return res.json({
      message: "An Error Occurred",
    });
  }
};
