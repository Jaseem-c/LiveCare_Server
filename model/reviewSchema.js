const mongoose = require('mongoose')

//2) Define Schema to store user collection
const reviewSchema=new mongoose.Schema({
    serviceProviderId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,    
    },
    date:{
        type:String,
        required:true
    },
    ratings:{
        type:Number,
        required:true
    },
    comments:{
        type:String,
        required:true
    }
})

//3) Create a model to store user
const review=mongoose.model('review',reviewSchema)

module.exports = review