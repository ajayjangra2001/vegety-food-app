require('dotenv').config();
const express = require('express');
const connection = require('./Config/db');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();

(async () => await connection())();

app.use(cors());
app.use(express.static('./public/build'));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => { 
    console.log('server has been started'); 
});


const userRouter = require('./Routers/userRouter');
const adminRouter = require('./Routers/adminRouter');
const planRouter = require('./Routers/planRouter');
const reviewRouter = require('./Routers/reviewRouter');
const bookingRouter = require('./Routers/bookingRouter');

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/plan', planRouter);
app.use('/review', reviewRouter);
app.use('/planDetails/review', reviewRouter);
app.use('/booking', bookingRouter);
