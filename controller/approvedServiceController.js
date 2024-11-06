//1) import admin model
const approvedServiceProvider = require('../model/approvedServiceprovider')
const serverviceProviders = require('../model/serviceproviderSchema')
const serviceProviderAttendence = require('../model/attendenceServiceProvider')
const serviceProviderLeaveReq=require('../model/leaveReqSchema')



//import jwt-token to authenticate user
const jwt = require('jsonwebtoken')

// nodemailer import
const nodemailer = require('nodemailer');
const serviceProvider = require('../model/serviceproviderSchema');
const leaveRequest = require('../model/leaveReqSchema')
const readytoBook = require('../model/readyToBook')
const Bookings = require('../model/bookings')


//Logic to approve serviceProvider
exports.approveServiceProvider = async (req, res) => {
    console.log('inside Api call to approve service provider');
    const { username, email, password, mobile, profile_img, service, specialization, qualification, experience_crt, exp_year, rate, location } = req.body
    try {
        const serviceProvider = await approvedServiceProvider.findOne({ email: email })
        if (serviceProvider) {
            res.status(401).json({ message: 'service provider already approved' })
        } else {
            const newServiceProvider = new approvedServiceProvider({
                username, email, password, mobile, profile_img, service, specialization, qualification, experience_crt, exp_year, rate ,location
            })
            await newServiceProvider.save()
            

            const response = await approvedServiceProvider.findOne({ email: email })
            if (response) {
                const id=response._id
                const readyUser=new readytoBook({ username,serviceProviderId:id, email, password, mobile, profile_img, service, specialization, qualification, experience_crt, exp_year, rate ,location})
                await readyUser.save()
                const result = await serverviceProviders.deleteOne({ email })
                textmessage = 'Your request as a service provider has been approved. You can now login to the platform and start offering your services.'
                subjectmail = 'Service Provider Approval Confirmation'
                await sendConfirmationEmail(email, subjectmail, textmessage);
                res.status(200).json({ newServiceProvider, message: "Service Provider approved" })
            } else {
                res.status(404).json({ message: 'Approval Faild' })
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'internal server error' })
    }
}

//Logic to reject service providers approval request
exports.rejectServiceProviderReq = async (req, res) => {
    console.log('inside Api call to reject user approval..!!!')
    const { email } = req.body;
    try {
        const deleteReq = await serverviceProviders.deleteOne({ email });
        if (!deleteReq) {
            return res.status(404).json({ message: 'Service provider not found' });
        }
        textmessage = 'Your request as a service provider has been rejected by the admin.'
        subjectmail = 'Rejection Mail...!!!'
        await sendConfirmationEmail(email, subjectmail, textmessage);
        res.status(200).json({ deleteReq, message: 'Service provider request deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//Logic for approved service provider login
exports.serviceProviderLogin = async (req, res) => {
    console.log('inside api call to login service provider');
    const { email, password } = req.body
    console.log(email);
    console.log(password);
    try {
        const existingUser = await approvedServiceProvider.findOne({ email, password })
        if (existingUser !== null && existingUser !== undefined) {
            const token = jwt.sign({
                serviceProviderid: existingUser._id,
                emailId:existingUser.email,
            }, 'superkey2024')
            res.status(200).json({ existingUser, token, message: 'Login Sucessfull' })
        } else {
            res.status(404).json({ message: 'Incorrect email or password' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Request not approved by the Admin' })
    }
}

// mail send usimg  smtp(simple mail transfer protocol)
async function sendConfirmationEmail(serviceProviderEmail,subjectmail,textmessage) {
    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.gmail, // Admin's email
            pass: process.env.gmailpsw // Admin's password
        }
    });


    // Send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'projectmern123@gmail.com', // Admin's email address
        to: [serviceProviderEmail], // Service provider's email address
        subject: subjectmail,
        text: textmessage
    });

    console.log('Confirmation email sent: ', info.messageId);
}

//Logic to get all approved service providers
exports.allServiceProviders = async (req, res) => {
    console.log('inside api call to get all approved service providers');
    try {
        const allApprovedServiceproviders = await approvedServiceProvider.find()
        res.status(200).json({ allApprovedServiceproviders, message: 'list of all service providers' })

    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }

}

//Logic to mark service provider attendence
exports.serviceProviderAttendance = async (req, res) => {
    console.log('Inside API call to mark attendance');
    const { date, time_in, time_out, working_hours, present } = req.body;

    try {
        console.log(date, time_in, time_out, working_hours, present);
        if (!date || !time_in || !time_out || !working_hours || !present) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const token = req.headers.authorization
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        jwt.verify(token, 'superkey2024', async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden invalid token' })
            }
            req.userId = decoded.serviceProviderid,
            req.userEmail = decoded.emailId
            const userId = req.userId;
            const userEmail=req.userEmail 
            console.log(userId);
            // Check if the service provider exists
            const user = await approvedServiceProvider.findOne({ _id: userId});
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Check if attendance for the service provider on the given date is already marked
            const check = await serviceProviderAttendence.findOne({serviceProviderId:userId,serviceProviderEmail:userEmail,date,time_in,time_out, working_hours, present: true });
            if (check) {
                return res.status(400).json({ message: 'Attendance already marked' });
            }

            // Create new attendance record
            const newAttendance = new serviceProviderAttendence({
                date, time_in,time_out, working_hours, serviceProviderId:userId,serviceProviderEmail:userEmail, present
            });
            await newAttendance.save();

            res.status(200).json({ message: 'Attendance marked successfully', newAttendance });
        })

    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ error, message: 'Internal server error' });
    }
};

//Logic to get service provider attendence list
exports.getAttendence=async(req,res)=>{
   console.log('inside api call to get service provider attendence')
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
          const userId = decoded.serviceProviderid;
          console.log(userId);
          const attendence= await serviceProviderAttendence.find({serviceProvidersId:userId})
          if(!attendence){
            res.status(400).json({message:"No attendece available "})
          }
          else{
            res.status(200).json({attendence,message:"Attendence List"})
 }
})  
   } catch (error) {
    res.status(500).json({ error, message: 'Internal server error' });
   }
}


//Logic for leave request
exports.leaveRequest=async(req,res)=>{
    console.log('inside api call to leave request');
    const {date,reason,additionalNotes}=req.body   
     try {
        console.log(reason,date,additionalNotes)
        const token = req.headers.authorization;
        console.log(token);
            if (!token) {
              return res.status(401).json({ message: "Unauthorized: No token provided" });
            }
            jwt.verify(token, 'superkey2024', async (err, decoded) => {
              if (err) {
                return res.status(403).json({ message: 'Forbidden: Invalid token' });
              }
              const userId = decoded.serviceProviderid;
              const emailId =decoded.emailId
             const user = await serviceProviderLeaveReq.findOne({serviceProviderId:userId ,date})
             const serviceProvider=await approvedServiceProvider.findOne({_id:userId})
             const name=serviceProvider.username
             const image=serviceProvider.profile_img
             if(user){
              res.status(400).json({message:"Leave Request already marked"})
             }
             else{
              const newleaveReq = new serviceProviderLeaveReq({
                serviceProviderId:userId,
                email:emailId,
                name,
                image,
                date,
                reason,
                additionalNotes,
                status:"pending"
              })
              await newleaveReq.save()
              res.status(200).json({newleaveReq,message:"Waiting for admin confirmation"})
             }
    
    
      })
      } catch (error) {
        res.status(500).json({message:"Internal server error"})
    
      }
}

//Logic to get user booking request in service provider dashboard
exports.getUserBookings = async (req, res) => {
    console.log('inside api call to get user bookings');
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
            const userId = decoded.serviceProviderid;
            console.log(userId);
            const userBookings = await Bookings.find({ serviceProviderId: userId, serviceProviderStatus: "pending" });
            console.log(userBookings);
            if (userBookings.length === 0) {
                res.status(400).json({ message: "No pending bookings available for this user" });
            } else {
                res.status(200).json({ userBookings, message: "Successfully fetched" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
//Logic to accept user bookings 
exports.acceptBooking=async(req,res)=>{
    console.log('inside api call to accept user bookings')
    const {id}=req.body
    try {
        const userBookings=await Bookings.findById(id)
        const bookingId=userBookings._id
        const status=userBookings.serviceProviderStatus

        const check=await Bookings.findOne({_id:bookingId,serviceProviderStatus:status})
        if(check.serviceProviderStatus === 'Accepted'){
            res.status(404).json({message:'Booking request already accepted'})
        }else{
            const acceptUserBooking= await Bookings.findByIdAndUpdate(id,{
                $set: {
                    serviceProviderStatus:'Accepted'
                  },
            },
            { new: true }
        );
        res.status(200).json({acceptUserBooking,message:'Booking accepted by service provider, waiting for admin confirmation'});
            
        }

    } catch (error) {
        res.status(500).json({message:"Internal server error"})  
    }

}

//Logic to reject user booking
exports.rejectBooking=async(req,res)=>{
  console.log('inside api call to reject user bookings')
  const {id}=req.body
  try {
    const userBookings=await Bookings.findById(id)
    const bookingId=userBookings._id
    const status=userBookings.serviceProviderStatus

    const check=await Bookings.findOne({_id:bookingId,serviceProviderStatus:status})
    if(check.serviceProviderStatus === 'Rejected'){
        res.status(404).json({message:'Booking request already Rejected'})
    }else{
        const acceptUserBooking= await Bookings.findByIdAndUpdate(id,{
            $set: {
                serviceProviderStatus:'Rejected'
              },
        },
        { new: true }
    );
    res.status(200).json({acceptUserBooking,message:'Booking Rejected by service provider, please check other available service providers '});
        
    }

} catch (error) {
    res.status(500).json({message:"Internal server error"})  
}

  
}

//Logic to update user profile image
exports.updateProfilePic=async(req,res)=>{
    console.log('inside api call to update user profile pic')
    const img=req.file.filename
    const newImg=`http://localhost:5000/uploadImage/${img}`
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
            const userId = decoded.serviceProviderid;
            console.log(userId);
            const existingUser = await approvedServiceProvider.find({ _id: userId });
            if(!existingUser){
                res.status(400).json({message:'user not found'})
            }else{
                const filter={ _id: userId };
                const update={
                    $set:{
                        profile_img:newImg
                    }
                }
                console.log(newImg);
                const result=await approvedServiceProvider.updateOne(filter,update)
                console.log(result);
    
                if(result.modifiedCount==1){
                    const filters={serviceProviderId: userId };
                    const updates={
                        $set:{
                            profile_img:newImg
                        }
                    }
                    const results=await readytoBook.updateOne(filters,updates)
                 const preUser=await approvedServiceProvider.findOne({_id: userId })
                 const preUsers=await readytoBook.findOne({serviceProviderId:userId })
                    res.status(200).json({preUser,preUsers,message:'Photo succesfully uploaded'})
                }else{
                    res.status(400).json({message:'Photo upload faild'})
                }
            }
        });
        
    } catch (error) {
        res.status(500).json({message:"Internal server error"})    
    }
}





