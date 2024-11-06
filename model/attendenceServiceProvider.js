//import mongoose
const mongoose=require('mongoose')

//2) Define Schema to store user collection
const serviceProviderAttendeceSchema=new mongoose.Schema({
    date:{
        type:String,
        required: true
    },
    time_in:{
        type:String,
        required: true
    },
    time_out:{
        type:String,
        required: true
    },
    working_hours:{
        type:Number,
        required: true
    },
    serviceProviderId:{
        type:String,
        required: true
    },
    serviceProviderEmail:{
        type:String,
        required: true
    },
    present:{
        type:Boolean,
        required: true
    }
})

//3) Create a model to store user
const serviceProviderAttendence=mongoose.model('serviceProviderAttendence',serviceProviderAttendeceSchema)


//4) Export model
module.exports=serviceProviderAttendence

