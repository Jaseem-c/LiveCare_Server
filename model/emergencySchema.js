//1) import mongoose
const mongoose = require('mongoose')


//2) Define Schema to store user collection
const emergencySchema=new mongoose.Schema({
    
    emergency_support:{
        type:String,
       
    },
    location:{
        type:String,
        
    },
    phonenumber:{
        type:String,
        
    }

})

//3) Create a model to store user
const emergency=mongoose.model('emergency',emergencySchema)

module.exports = emergency