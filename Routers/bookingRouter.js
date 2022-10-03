const express = require('express');
const bookingRouter = express.Router();

const {
   createSession
} = require('../Controllers/bookingController');


bookingRouter.post('/payment', createSession);

module.exports = bookingRouter;