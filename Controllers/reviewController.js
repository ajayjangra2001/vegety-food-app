const Plan = require("../Models/planModel");
const Review = require("../Models/reviewModel");
const { User } = require("../Models/userModel");
const jwt = require("jsonwebtoken");

module.exports.top10Reviews = async function top10Reviews(req, res) {
  try {
    const reviews = await Review.find()
      .sort({
        ratings: -1,
      })
      .limit(10);

    if (reviews) {
      return res.json({
        message: "Reviews retrieved",
        data: reviews,
      });
    } else {
      return res.json({
        message: "No reviews found",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

module.exports.getPlanReviews = async function getPlanReviews(req, res) {
  try {
    const plan_id = req.params.id;
    let reviews = await Review.find();

    if (reviews) {
      let newReviews = reviews.filter(
        (review) => review.plan && review.plan._id == plan_id
      );

      if (newReviews) {
        return res.json({
          message: "Reviews retrieved",
          data: [...newReviews],
        });
      } else {
        return res.json({
          message: "No Reviews Found For this plan",
        });
      }
    } else {
      return res.json({
        message: "No reviews found",
      });
    }
  } catch (error) {
    res.json({
      message: "An Error Occurred",
    });
  }
};

module.exports.createReview = async function createReview(req, res) {
  try {
    let token;
    if (req.cookies.$food_app_login$) {
      token = req.cookies.$food_app_login$.jwt_token;

      let payload = jwt.verify(token, process.env.JWT_KEY);

      if (payload) {
        const user = await User.findById(payload.payload);
        req.body.user = user._id.toString();
        const plan = req.params.planId;
        let rplan = await Plan.findById(plan);
        req.body["plan"] = plan;

        let review = await Review.create(req.body);

        rplan.ratingsAverage = (
          (rplan.ratingsAverage + parseInt(req.body.rating)) /
          2
        ).toPrecision(3);
        await rplan.save();

        res.json({
          message: "Review Created",
          data: review,
        });
      } else {
        const client = req.get("User-Agent");
        if (client.includes("mozilla")) {
          return res.redirect("/login");
        }
        return res.json({
          message: "Please login again",
        });
      }
    } else {
      res.json({
        message: "Please Login",
      });
    }
  } catch (error) {
    return res.json({
      message: "Please provide following details",
    });
  }
};

module.exports.deleteReview = async function deleteReview(req, res) {
  try {
    if (req.cookies.$food_app_login$) {
      const { id } = req.params;

      if (id) {
        let review = await Review.findById(id);

        if (review) {
          
          const _id  = review.user._id.toString();

          if (req.cookies.$food_app_login$.userData._id === _id) {

            await review.remove();

            return res.json({
              message : 'Review deleted successfully'
            })
             
          } else {
            return res.json({
              message : 'You are not the correct user to perform this operation'
            })
          }

        
        } else {
          return res.json({
            message: "No Plan Found",
          });
        }
      } else {
        return res.json({
          message: "Something went wrong",
        });
      }
    } else {
      return res.json({
        message: "You are not an authorised person to perform this operation",
      });
    }
  } catch (error) {
    return res.json({
      message: "An Error Occurred",
    });
  }
};

module.exports.updateReview = async function updateReview(req, res) {
  try {
    if (req.cookies.$food_app_login$) {
      const { id } = req.params;

      if (id) {
        let review = await Review.findById(id);

        if (review) {
          
          const _id  = review.user._id.toString();

          if (req.cookies.$food_app_login$.userData._id === _id) {

            review = { ...review._doc, ...req.body, createdAt : Date.now() };

            await Review.findByIdAndUpdate(review._id, review);

            return res.json({
              message : 'Review updated successfully'
            })
             
          } else {
            return res.json({
              message : 'You are not the correct user to perform this operation'
            })
          }

        } else {
          return res.json({
            message: "No Plan Found",
          });
        }
      } else {
        return res.json({
          message: "Something went wrong",
        });
      }
    } else {
      return res.json({
        message: "You are not an authorised person to perform this operation",
      });
    }
  } catch (error) {
    return res.json({
      message: "An Error Occurred",
    });
  }
};
