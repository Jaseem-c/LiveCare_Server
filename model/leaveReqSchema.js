//1) import mongoose
const mongoose = require('mongoose')

//2) Define Schema to store user collection
const leaveReqSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    reason:{
        type:String,
        required:true
    },
    additionalNotes:{
        type:String,
       
    },
    status:{
        type:String,
        required:true
    },
    serviceProviderId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    }
    

})

//3) Create a model to store user
const leaveRequest= mongoose.model('leaveRequest',leaveReqSchema)

//4) Export model
module.exports=leaveRequest