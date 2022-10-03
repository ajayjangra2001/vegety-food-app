const { User, validate } = require("../Models/userModel");
const sendEmail = require("../Utils/sendMail");
const Token = require("../Models/token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

module.exports.signup = async function signup(req, res) {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.json({
        message: error.details[0].message,
      });

    let user = await User.findOne({ email: req.body.email });


    if (user) {
      return res.json({
        message: "User with given email already exist!",
      });
    }

    user = await User.create(req.body);

    let token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const verificationLink = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;

    const rval = await sendEmail(user.email, "VU", verificationLink);

    if (rval === true)
      return res.json({
        message:
          "An Email sent to your account, Please verify for further services",
      });

    res.json({
      message: "An Error occurred at server side",
    });
  } catch (error) {
    return res.json({
      message: "An error occurred",
    });
  }
};

module.exports.verifyUser = async function verifyUser(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user)
      return res.json({
        message: "Invalid Link",
        verified: false,
      });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token)
      return res.json({
        message: "Invalid Link",
        verified: false,
      });

    await User.findByIdAndUpdate(user._id, { verified: true });

    await Token.findByIdAndRemove(token._id);

    res.json({
      message: "Email Verfied Successfully",
      verified: true,
    });
  } catch (error) {
    res.json({
      message: "An Error Occurred!",
      verified: false,
    });
  }
};

module.exports.login = async function login(req, res) {
  try {
    if (req.cookies.$food_app_login$)
      return res.json({
        message:
          "User is already logged In, Please logout first to login again",
      });

    const { email } = req.body;

    if (email) {
      let user = await User.findOne({ email: email });

      if (user) {
        const user_data = (({
          _id,
          name,
          email,
          password,
          role,
          verified,
        }) => ({ _id, name, email, password, role, verified }))(user);

        if (user_data.role === "User") {
          if (user_data.verified === false)
            return res.json({
              message:
                "Please confirm your email first by clicking on link that have been sent on your entered email",
            });

          const { password } = req.body;

          const rVal = await bcrypt.compare(password, user_data.password);

          if (rVal === true) {
            let jwt_token = jwt.sign(
              { payload: user_data._id },
              process.env.JWT_KEY
            );
            res.cookie(
              "$food_app_login$",
              { jwt_token: jwt_token, userData: user_data },
              { httpOnly: true }
            );

            return res.json({
              message: "User Signed In Successfully",
              data: user,
            });
          }

          res.json({
            message: "Invalid User Credentials",
          });
        } else {
          const { password } = req.body;
          const rVal = await bcrypt.compare(password, user_data.password);

          if (rVal === true) {
            let jwt_token = jwt.sign(
              { payload: user_data._id },
              process.env.JWT_KEY
            );
            res.cookie(
              "$food_app_login$",
              { jwt_token: jwt_token, userData: user_data },
              { httpOnly: true }
            );

            return res.json({
              message: "Admin Signed In Successfully",
              data: user_data,
            });
          }
        }
      } else {
        return res.json({
          message: "User not registered with entered email Id",
        });
      }
    } else {
      return res.json({
        message: "Verify your details",
      });
    }
  } catch (error) {
    res.json({
      message: "An Error Occurred!",
    });
  }
};

module.exports.forgotPassword = async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (email) {
      const user = await User.findOne({ email: email });

      if (user) {
        let token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const forgotPasswordLink = `${process.env.BASE_URL}/user/forgotPassword/${user.id}/${token.token}`;

        const rval = await sendEmail(user.email, "RP", forgotPasswordLink);

        if (rval === true)
          return res.json({
            message:
              "An Email has been sent at your entered id, Please click on following link",
            code: 1,
          });

        res.json({
          message: "An Error occurred at server side",
        });
      } else {
        return res.json({
          message: "User not exist with Entered Email Id, Please verify you Id",
        });
      }
    } else {
      return res.json({
        message: "Verify your entered email",
      });
    }
  } catch (error) {
    res.json({
      message: "An Error Occurred!",
    });
  }
};

module.exports.updatePassword = async function updatePassword(req, res) {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ _id: id });

    if (!user)
      return res.json({
        message: "Invalid Link",
        isUpdated: false,
      });

    const dbToken = await Token.findOne({
      userId: user._id,
      token: token,
    });

    if (dbToken === null || !dbToken)
      res.json({
        message: "Invalid Link",
        isUpdated: false,
      });

    await User.updateOne({ _id: user._id, password: password });

    await Token.findByIdAndRemove(dbToken._id);

    res.json({
      message: "New Password has been created Successfully",
      isUpdated: true,
    });
  } catch (error) {
    res.json({
      message: "An Error Occurred!",
      isUpdated: false,
    });
  }
};

module.exports.updateUser = async function updateUser(req, res) {
  try {
    if (req.cookies.$food_app_login$) {
      const { id } = req.params;

      if (id) {
        let user = await User.findById(id);

        if (user) {
          const { name, password } = req.body;

          user = { ...user._doc, name, password };

          await User.replaceOne(
            { _id: id },
            { ...user, name: name, password: password }
          );

          return res.json({
            message: "User Updated Successfully",
            data: user,
          });
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
        message: "Please Logged In First",
      });
    }
  } catch (error) {
    return res.json({
      message: "An Error Occurred",
    });
  }
};

module.exports.updateProfilePic = async function updateProfilePic(req, res) {
  try {
    const id = req.params.id;

    if (id) {
      let user = await User.findById(id);

      if (user) {
        const destination = path.join(path.resolve(__dirname, ".."), "Uploads");

        user.profileImage["data"] = fs.readFileSync(
          path.join(destination, req.file.filename)
        );

        user.profileImage["contentType"] = req.file.mimetype;

        const response = await User.findByIdAndUpdate(user._id, user);

        return res.json({
          message: "Profile added successfully",
          data: user,
        });
      } else {
        return res.json({
          message: "User Not Found",
        });
      }
    } else {
      return res.json({
        message: "No user found",
      });
    }
  } catch (error) {
    return res.json({
      message: "An Error Occurred" + error.message,
    });
  }
};

module.exports.getUserProfile = async function getUserProfile(req, res) {
  try {
    if (req.cookies.$food_app_login$) {
      const { id } = req.params;

      if (id) {
        const user = await User.findById(id);

        if (user) {
          return res.json({
            message: "Profile Retrieved",
            data: user,
          });
        } else {
          return res.json({
            message: "User Not Found",
          });
        }
      } else {
        return res.json({
          message: "Something went going wrong",
        });
      }
    } else {
      return res.json({
        message: "Please login first",
      });
    }
  } catch (error) {
    return res.json({
      message: "An error occurred",
    });
  }
};

module.exports.logout = function logout(req, res) {
  if (req.cookies.$food_app_login$) {
    res.cookie("$food_app_login$", "", { maxAge: 1 });
    res.json({
      message: "User logout successfully",
    });
  } else {
    return res.json({
      message: "User is not signed out",
    });
  }
};
