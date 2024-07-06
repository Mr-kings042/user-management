const  asynchandler = require('express-async-handler');
const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const JWTTOKEN = process.env.JWTTOKEN;
const  User = require('../models/user');
const Organisation = require('../models/organisation');


const RegisterUser = asynchandler (async (req, res) =>{
    const {firstName,lastName,email,password,phone} = req.body;
    if(!firstName || !lastName || !email || !password || !phone){
        res.status(422).json({
            errors: [
    {
      field: error.param ,
      message: "please fill all the fields"
    },
  ]
        });
        }
        const userExist = await User.findOne({email});
        if(userExist){
            res.status(400).json({
                message:"User already exist"
                });
                }
try {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = Math.random().toString().slice(2, 15);
 const user = new User({
     userId, 
     firstName, 
     lastName,
      email,
      password: hashedPassword, 
      phone });
     await user.save();
                
const orgName = `${firstName}'s Organization`;
const organisation = new Organisation({ 
    orgId: Math.random().toString().slice(2, 15),
    name: orgName,
     users: [user._id] });
await organisation.save();
                
const accessToken = jwt.sign({
     userId: user.userId },
      JWTTOKEN,
      { expiresIn: '1h' });
                
 res.status(201).json({
 status: 'success',
message: 'Registration successful',
data: {
 accessToken: accessToken,
 user: {
 userId: user.userId,
firstName: user.firstName,
lastName: user.lastName,
email: user.email,
phone: user.phone
 }
 }
});
} catch (error) {
res.status(400).json({
 status: 'Bad request',
 message: 'Registration unsuccessful',
statusCode: 400
});
 }             
});

const Userlogin = asynchandler(async (req,res) =>{
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!user || !passwordMatch) {
          return res.status(401).json({
            status: 'Bad request',
            message: 'Authentication failed',
            statusCode: 401
          });
        }
    
        const accessToken = jwt.sign({
             userId: user.userId,
             email: user.email
             }, JWTTOKEN,
             { expiresIn: '1h' });
            
    
        res.status(200).json({
          status: 'success',
          message: 'Login successful',
          data: {
            accessToken: accessToken,
            user: {
              userId: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone
            }
          }
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'An error occurred',
          statusCode: 500
        });
      }
    
});

const getUser = asynchandler(async(req,res) =>{
    try {
const user = await User.findOne({ userId: req.params.id });
if (!user) {
    return res.status(404).json({
         status: 'error', 
         message: 'User not found', 
         statusCode: 404 });
  }

  res.status(200).json({
    status: 'success',
    message: 'User details fetched successfully',
    data: {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone
    }
  });
} catch (error) {
  res.status(500).json({ 
    status: 'error', 
    message: 'An error occurred', 
    statusCode: 500 });
}

});

module.exports = {
    RegisterUser,
    Userlogin,
    getUser
};