//1) import mongoose
const mongoose = require('mongoose')


//2) Define Schema to store user collection
const mainCategorySchema=new mongoose.Schema({
    mainCategory:{
        type:String,
        required:true,
        unique:true
    },
    subCategory:{
        type:[]
    }
})

//3) Create a model to store user
const mainCategory=mongoose.model('mainCategory',mainCategorySchema)

module.exports = mainCategory