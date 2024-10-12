const express = require('express');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/auth', authRoute)

app.listen(process.env.PORT, () => {
    console.log(`API is online on port ${process.env.PORT || 4000}`)
})