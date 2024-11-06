
//1) import users model
const users=require('../model/userSchema')
const readytoBook = require('../model/readyToBook')
const bookings=require('../model/bookings')
const review=require('../model/reviewSchema')
const transactions=require('../model/transactions')
const blockedServiceProvider=require('../model/blockedServiceProviders')


//import bcryptjs for hide the password
const bcryptjs = require('bcryptjs');
const cron = require('node-cron');

//import jwt-token to authenticate user
const jwt=require('jsonwebtoken'); 
const Bookings = require('../model/bookings');
const transaction = require('../model/transactions')


// Logic for user registeration
exports.registerUser=async(req,res)=>{
    console.log('Inside api call for user registeration');
    const {username,email,password,number,address} =req.body
    const hashedPassword=bcryptjs.hashSync(password, 10)
    try{
        const existingUser=await users.findOne({email:email});
        if(existingUser){
            res.status(406).json({message:'Account already exist'})
        }else{
            const newUser=new users({
                username,email,password:hashedPassword,number,address
            });
            await newUser.save()
            res.status(200).json({newUser,message:'Account Registered'})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Internal server error'})
    }
}

// Logic for User-login
exports.loginUser=async(req,res)=>{
    console.log('Inside API call to login user');
    const{email,password}=req.body
    try{
        const existingUser=await users.findOne({email})
        if(!existingUser)
          return res.status(404).json({message:'User not found'})
        const validPassword=bcryptjs.compareSync(password,existingUser.password)
        if(!validPassword)
         return res.status(401).json({message:'Incorrect password'})
         const token=jwt.sign({
              userid:existingUser._id,
              userEmailId:existingUser.email,
              userName:existingUser.username
            },"superkey2024")
            res.cookie('access_token',token,{httpOnly :true}).status(200).json({existingUser,token})
    }catch(err){
        res.status(401).json({message:'Account does not exist'}) 
    }
}

//Logic for google sign-in (backend logic created but not tested . test after frontend integrated)
exports.googleLogin=async(req,res,next)=>{
    try{
        const user=await users.findOne({email: req.body.email})
        if(user){
            const token=jwt.sign({userid:user._id},"superkey2024")
            res.cookie('access_token',token,{httpOnly :true}).status(200).json({user,token})
        }else{
            const generatedPassword=Math.random().toString(36).slice(-8)+ Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser= new users({
                username:req.body.name.split(' ').join('').toLowerCase() +Math.random().toString(36).slice(-4), 
                email:req.body.email,
                 password:hashedPassword})// photo not added
                 await newUser.save();
                 const token=jwt.sign({userid:user._id},"superkey2024")
                 res.cookie('access_token',token,{httpOnly :true}).status(200).json({user,token})

        }

    }catch(error){
        next(error)
    }
}

//Logic to signout user
exports.singnOut=async(req,res)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
      } catch (error) {
        next(error);
      }
}

//Logic for delete user
exports.deleteUser=async(req,res)=>{
    const userId = req.params.id;
    try {
        // Find the user by ID
        const user = await users.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        await users.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
      } 
}

//Logic to edit user details
exports.editUser=async(req,res)=>{
    console.log('Inside api call for edit user details');
    
    try{
        // if (req.body.password) {
        //     req.body.password = bcryptjs.hashSync(req.body.password, 10);
        //   }

          const updatedUser = await users.findByIdAndUpdate(
            req.params.id,
            
            {
              $set: {
                username: req.body.username,
                email: req.body.email,
                // password: req.body.password,
                number: req.body.number,
                address: req.body.address
              },
            },
            { new: true }
          );
          res.status(200).json({updatedUser,message:'user details updated'});
    }catch(error){
        res.status(500).json({ message: 'Internal server error' });
    }
    
}

//Logic to get all users list
exports.allUsers=async(req,res)=>{
  console.log('inside api call to get all users');
  try {
    const allUsersList=await users.find()
    res.status(200).json({allUsersList,message:'All users list'})
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

//Logic to reset user password
exports.ResetUserPassword=async(req,res)=>{
    console.log('inside API call for reset password');
    try {
         if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
            const resetPass = await users.findByIdAndUpdate(
                req.params.id,
                
                {
                  $set: {

                    password: req.body.password,
                  },
                },
                { new: true }
              );
              res.status(200).json({resetPass,message:'Password updated successfully'});

          }
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }
}
//Logic to search service provider
exports.searchServiceProvider = async (req, res) => {
  console.log('inside api call to search service provider');
  const { location, service } = req.body;
  try {
      const searchUser = await readytoBook.find({ location, service });
      if (searchUser.length === 0) {
          res.status(400).json({ message: 'No service provider available in this location' });
      } else {
          res.status(200).json({ searchUser, message: 'List of service providers in this location' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
};


//logic to book service provider primery
exports.PrimaryBooking=async(req,res)=>{
  console.log('inside service provider Primary booking function')
      const {typeOfCare,services,startingTime,endingTime,startDate,endDate,location,
        serviceProviderName,service,serviceProviderId,profile_img,serviceProviderEmail,
        serviceProviderMobile,rate,workinghours,amountPaid}=req.body
         console.log(typeOfCare,services,startingTime,endingTime,startDate,endDate,location,
          serviceProviderName,service,serviceProviderId,profile_img,serviceProviderEmail,
          serviceProviderMobile,rate,workinghours,amountPaid);
          const formattedStartTime = formatToTime(startingTime);
        const formattedEndTime = formatToTime(endingTime);
        try {
          const token = req.headers.authorization;
            console.log(token);
         if (!token) {
                  return res.status(401).json({ message: "Unauthorized: No token provided" });
           }
          jwt.verify(token, 'superkey2024', async (err, decoded) => {
            if (err) {
              return res.status(403).json({ message: 'Forbidden: Invalid token' });
            }
        
          const userEmail= decoded.userEmailId
           const userName=decoded.userName
           const userId =decoded.userid

        const PrimaryReg=await Bookings({userEmail,userName,userId,typeOfCare,services,
          startingTime:formattedStartTime,endingTime:formattedEndTime,startDate,endDate,location,serviceProviderName,
          service,serviceProviderId,profile_img,serviceProviderEmail, serviceProviderMobile,
          rate,workinghours,serviceProviderStatus:'pending',adminStatus:'pending',amountPaid,amountStatus:'unpaid'})

         await PrimaryReg.save()
          res.status(200).json({PrimaryReg,message:'Waiting For Service Provider Confirmation'})
           
        } )

        } catch (error) {
          res.status(500).json({ message: 'Internal server error' });  
        }
}

//Logic to add review to a service provider
exports.addReview=async(req,res)=>{
  console.log('inside api call to add review')
  const {serviceProviderId,ratings,comments}=req.body
  console.log(serviceProviderId,ratings,comments);
  try {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    jwt.verify(token, 'superkey2024', async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        const username = decoded.userName;
        console.log(username);
        if (!ratings || !comments) {
          return res.status(400).json({ message: "Missing required fields" });
        } else {
          const newReview = new review({
            serviceProviderId,
            username: username,
            date: new Date(),
            ratings,
            comments
          });
          
          await newReview.save();
          
          res.status(200).json({ newReview, message: "Review added successfully" });
        }
    
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });  
  }
}

//Logic to get service provider reviews
exports.getReviews=async(req,res)=>{
  console.log('inside api call to get reviews')
  const {id}=req.params
  try {
    const viewReviews=await review.find({serviceProviderId:id})
    if(!viewReviews){
      res.status(400).json({message:'No Reviews'})
    }else{
      res.status(200).json({viewReviews,message:'Reviews of service provider'})
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });   
  }

}

// conversion to time
function formatToTime(number) {
  const formattedTime =` ${number.toString().padStart(2, '0')}:00;`
  return formattedTime;
}




//Get booking on user dashboard
// payment and booking confirm
exports.payment = async (req, res) => {
  const { id } = req.body; // booking id
  const date = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, "superkey2024", async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }

      const userEmail = decoded.userEmailId;
      const userName = decoded.userName;
      const userId = decoded.userid;

      const user = await Bookings.findById(id);
      if (!user) {
        return res.status(404).json({ message: "No booking data available" });
      }

      const serviceproviderId = user.serviceProviderId;
      console.log(serviceproviderId)
      // const serviceProvider = await readytoBook.findOne({serviceProvidersId:serviceproviderId});
      const serviceProvider = await readytoBook.findOne({ serviceProviderId: serviceproviderId });

      console.log(serviceProvider)
      if (!serviceProvider) {
        return res.status(401).json({ message: "No service provider available, book with another one" });
      }

      const pay = await Bookings.findOneAndUpdate(
        { _id: id,serviceProviderStatus: "Accepted",adminStatus: "approved", amountStatus: "unpaid" },
        { $set: { amountStatus: "paid" } },
        { new: true }
      );

      if (!pay) {
        return res.status(404).json({ message: "Payment already processed" });
      }

      const blockeduser = await blockedServiceProvider.findOne({serviceProviderId:serviceproviderId});
      if (blockeduser) {
        return res.status(400).json({ message: "Sorry for the inconvenience, this service provider is unavailable now" });
      }

      const transactions = new transaction({
        bookingId: id,
        fromID: userId,
        from_Name: userName,
        To_ID: "65f3c3454247fe18fe09ed2e",
        To_Name: "admin",
        Date: date,
        amount: pay.amountPaid,
        Status: "credited"
      });
      await transactions.save();

      const blockedlist = await blockedServiceProvider.insertMany(serviceProvider);
      const deletelist = await readytoBook.deleteOne({ serviceProviderId: serviceproviderId });

      const textmessage = 'your booking placed';
      const subjectmail = 'Booking confirmed!!!!!';
      // await sendConfirmationEmail(userEmail, subjectmail, textmessage);

      res.status(200).json({ booking: pay, message: "Payment successful and booking confirmed" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

cron.schedule('* * * * *', async () => {
          
  try {
      const currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

      const currentTime = new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit',second:'2-digit' });
      const users = await Bookings.find({endingTime:currentTime,endDate:currentDate})
      if(users.length>0){
          console.log("testing started");
          for (const user of users) {
              const updatedBooking = await Bookings.findOneAndUpdate(
                  { _id: user._id },
                  { $set: { bookingPeriod:"completed" } },
                  { new: true }
                );
              const readytobook = await blockedServiceProvider.findOne({serviceProviderId:user.serviceProviderId});
              const serviceprovider = await readytoBook.insertMany(readytobook)
              const newuser = await blockedServiceProvider.deleteOne({serviceProviderId:user.serviceProviderId})
          }
          console.log("success");
          res.status(200).json({updatedBooking,message:"successful"})
      }
      else{

          res.status(400).json({message:"unsuccessful"})
      }

      


  } catch (error) {
      res.status(500).json({ message: "internal server error" });

  }
})

// get unpaid service booking  bill 
exports.getUnpaidBill = async(req,res)=>{
  try {
      const token = req.headers.authorization;
      console.log(token);
          if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
          }
      jwt.verify(token, "superkey2024", async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
          }
     
          const userEmail= decoded.userEmailId
        
         const userName=decoded.user_name
         const userId =decoded.userid
     console.log(userEmail);
      const bill = await Bookings.find({userId:userId,adminStatus:"approved",amountStatus:"unpaid"})
    
      if(bill.length>0){
          res.status(200).json({bill,message:"bill fetched successfully"})
      }
      else{
          res.status(400).json({message:"No bill to Paid"})

      }
   
      } )  
      } catch (error) {
      res.status(500).json({message:"internal server error"})

  }
}

//Logic to get paid bills
exports.userPaidBills=async(req,res)=>{
  console.log('inside api call to get user paid bills')
  try {
    const token = req.headers.authorization;
    console.log(token);
        if (!token) {
          return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
    jwt.verify(token, "superkey2024", async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
   
        const userEmail= decoded.userEmailId
      
       const userName=decoded.user_name
       const userId =decoded.userid
   console.log(userEmail);
    const bills = await Bookings.find({userId:userId,adminStatus:"approved",amountStatus:"paid"})
  
    if(bills.length>0){
        res.status(200).json({bills,message:"user paid bills"})
    }
    else{
        res.status(400).json({message:"No Booking payments"})

    }
 
    } )  
    
  } catch (error) {
    res.status(500).json({message:"internal server error"}) 
  }
}

//Logic to get all service providrs fromreadytobook
exports.getAllServiceProviders=async(req,res)=>{
  console.log('inside api call to get all service providers from ready to book')
  try {
    const allServiceProviders=await readytoBook.find()
    res.status(200).json({allServiceProviders,message:"list all service providers that are ready to book"})
    
  } catch (error) {
    res.status(500).json({message:"internal server error"})
  }
}

//Logic to get user payment history
exports.getPaymentHistory=async(req,res)=>{
  console.log('inside api call to get payment history')
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, "superkey2024", async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
      }

      const userEmail = decoded.userEmailId;
      const userName = decoded.userName;
      const userId = decoded.userid;

      // const user = await Bookings.findById(id);
      // if (!user) {
      //   return res.status(404).json({ message: "No booking data available" });
      // }

      const transactionHistory=await transactions.find({fromID:userId})
      res.status(200).json({transactionHistory,message:"transaction history of user"})
    });
    
  } catch (error) {
    
    res.status(500).json({message:"internal server error"})
  }

}
