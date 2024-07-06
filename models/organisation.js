const mongoose = require('mongoose');

const OrganisationSchema =  new mongoose.Schema({
    orgId:{
        type: String,

    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    users: [{ 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User' }]
},
{ timestamps: true}
);
module.exports = mongoose.model('Organisation', OrganisationSchema);