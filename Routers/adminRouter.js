const express = require("express");
const adminRouter = express.Router();

const {
  getAllPlans,
  getAllUsers,
  addPlan,
  deleteUser,
  deletePlan,
  updatePlan,
} = require("../Controllers/adminController");

adminRouter.route("/allPlans").get(getAllPlans);

adminRouter.route("/allUsers").get(getAllUsers);

adminRouter.route("/addPlan").post(addPlan);

adminRouter.route("/deleteUser/:id").delete(deleteUser);

adminRouter.route("/updatePlan/:id").patch(updatePlan);

adminRouter.route("/deletePlan/:id").delete(deletePlan);

module.exports = adminRouter;
