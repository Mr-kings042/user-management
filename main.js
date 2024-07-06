const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('dotenv').config();
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT;
const JWTTOKEN = process.env.JWTTOKEN;
const DB_URL = process.env.DB_URL;
const connectDB = require('./config/dbconn');
connectDB();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.use('/', require('./routes/organisation'));
app.use('/', require('./routes/user'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});