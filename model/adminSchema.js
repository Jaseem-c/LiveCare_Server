//1) import mongoose
const mongoose = require('mongoose')

//2) Define Schema to store user collection 
const adminSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})
//3) Create a model to store user
const Admin=mongoose.model('Admin',adminSchema)

//4) Export model
module.exports=Admin