const asynchandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/user');
const Organisation = require('../models/organisation');

const getOrganisations = asynchandler (async (req,res) =>{
    try{
// const user = await User.findOne({
//   userId: req.user.userId }).populate('organisations');
const organisations = await Organisation.find();     
  
res.status(200).json({
  status: 'success',
  message: 'Organisations fetched successfully',
data: {
   organisations
  
  }
 });
       
} catch(error){
res.status(500).json({
status: 'error',
 message: 'An error occurred',
  statusCode: 500 });
    }
});

const getOrganisation = asynchandler(async(req,res) =>{
    try {
  const organisation = await Organisation.findOne({
     orgId: req.params.orgId });
if (!organisation) {
 return res.status(404).json({ 
   status: 'error',
      message: 'Organisation not found', 
   statusCode: 404 });
  }
    
        res.status(200).json({
          status: 'success',
          message: 'Organisation details fetched successfully',
          data: {
            orgId: organisation.orgId,
            name: organisation.name,
            description: organisation.description
          }
        });
      } catch (error) {
        res.status(500).json({ 
            status: 'error',
             message: 'An error occurred',
              statusCode: 500 });
      }
});

const createOrganisation = asynchandler (async(req,res) =>{
    const { name, description } = req.body;

    try {
      const organisation = new Organisation({ 
         name, 
         description });
      await organisation.save();
  
      const user = await User.findOne({
         userId: req.user.userId });
      organisation.users.push(user);
      await organisation.save();
  
      res.status(201).json({
        status: 'success',
        message: 'Organisation created successfully',
        data: {
          orgId: organisation.orgId,
          name: organisation.name,
          description: organisation.description
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'Bad Request',
        message: 'Client error',
        statusCode: 400
      });
    }
    
});

const addUser = asynchandler(async(req,res) =>{
    const { userId } = req.body;

  try {
    const organisation = await Organisation.findOne({ 
        orgId: req.params.orgId });
    if (!organisation) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Organisation not found', 
        statusCode: 404 });
    }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'User not found', 
        statusCode: 404 });
    }

    organisation.users.push(user);
    await organisation.save();

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully'
    });
  } catch (error) {
    res.status(500).json({ 
        status: 'error', 
        message: 'An error occurred', 
        statusCode: 500 });
  }

});

module.exports = {
    getOrganisation,
    getOrganisations,
    createOrganisation,
    addUser
};