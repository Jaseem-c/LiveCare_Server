//1) automatically load dotenv file in the application
require('dotenv').config()

//2) import express
const express=require('express')

//6) Import cors
 const cors=require('cors')

//9) Import connection.js file for connecting mongoDB
  require('./connection')



//3) Create a application using express
const server=express()

//4) define port
  const PORT=5000

//5) Run application
server.listen(PORT,()=>{
    console.log('Server listening to port' +PORT);
})

//enable image folder
server.use('/UploadblogImage',express.static('./UploadblogImage'))  
server.use('/uploadCertificate',express.static('./uploadCertificate'))  
server.use('/uploadImage',express.static('./uploadImage'))  
server.use('/uploadWebinarImg',express.static('./uploadWebinarImg'))  


//10)  Import router
const router=require('./routes/router')

//7) Use cors
//  server.use(cors())
server.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
 server.use(express.json())//express.json method is used to convert object data to array
 server.options("*", cors());
// server.use(cookieParser())
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});
 server.use(router)

 //8) define routes
  server.get('/',(req,res)=>{
    res.status(200).json('senior citizen care service started')
  })

