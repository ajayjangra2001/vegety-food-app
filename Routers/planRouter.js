const express = require('express');
const planRouter = express.Router();

const {
    getAllPlans,
    getPlan,
    top3Plans
} = require('../Controllers/planController');


planRouter
.route('/topPlans')
.get(top3Plans)

planRouter
.route('/allPlans')
.get(getAllPlans)

planRouter
.route('/:id')
.get(getPlan)

module.exports = planRouter;