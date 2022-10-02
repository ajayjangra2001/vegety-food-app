require('dotenv').config();
const express = require('express');
const connection = require('./Config/db');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();

// const destination = path.join(path.resolve(__dirname, '..'), 'Uploads')


(async () => await connection())();

app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.urlencoded({
//     extended: false
// }));
// app.use(express.static(destination));

app.listen(5000, () => { 
    console.log('server has been started'); 
});


const userRouter = require('./Routers/userRouter');
const adminRouter = require('./Routers/adminRouter');
const planRouter = require('./Routers/planRouter');
const reviewRouter = require('./Routers/reviewRouter');

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/plan', planRouter);
app.use('/review', reviewRouter);
app.use('/planDetails/review', reviewRouter);


