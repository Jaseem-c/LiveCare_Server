//1) Import mongoose
const mongoose=require('mongoose')

//2) Add connection from dotenv file
const DB=process.env.DATABASE

//3) Connect code 
mongoose.connect(DB).then(()=>{
    console.log(('Database connection established'));
}).catch((err)=>{
    console.log(err);
})