//1) import mongoose
const mongoose = require('mongoose')

//2) Define Schema to store user collection
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }
})

//3) Create a model to store user
const User= mongoose.model('User',userSchema)

//4) Export model
module.exports=User

