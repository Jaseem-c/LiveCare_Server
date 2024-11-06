//import express
const express=require('express')

//2) import controllers
const userController=require('../controller/userController')
const adminController=require('../controller/adminController')
const serviveproviderController=require('../controller/serviceproviderController')
const approvedServiceProvider=require('../controller/approvedServiceController')
const chats=require('../controller/chatController')
const mainCategoryController=require('../controller/categoryController')

//import certificate multer file
const upload=require('../multer/storageConfig')

//import image multer file
const uploadImg=require('../multer/storageConfigImg')
const uploadPDF = require('../multer/storageConfig')


//3) Using express create a object for router class in order to setpath
const router=new express.Router()

//Backend API calls

//Register API call
router.post('/user/register',userController.registerUser)

//Login API call
router.post('/user/login',userController.loginUser)

//Google sign-in API call
router.post('/google',userController.googleLogin)

//Logout API call
router.get('/logout',userController.singnOut)

//Delete user API call
router.delete('/deleteUser/:id', userController.deleteUser);

//Edit user API call
router.post('/editUser/:id',userController.editUser)

//Reset user password
router.post('/resetUserPassword/:id',userController.ResetUserPassword)

//get all users api call
router.get('/users/list',userController.allUsers)

//Admin Login API call
router.post('/adminLogin',adminController.adminLogin)

//serviceProvider primary registeration API call
router.post('/serviceProvier/register',uploadPDF.single('experience_crt'),serviveproviderController.serviceProviderRegisteration)

//serviceProvider secondary registration API call
router.post('/serviceProvider/fianlRegtration',uploadImg.single('profile_img'),serviveproviderController.finalReg)

//Get all service providers list inside the admin dashboard to approve 
router.get('/allServiceProviders/list',adminController.getAllserviceproviders)

//Api to approve service provider request
router.post('/approve/serviceProvider',approvedServiceProvider.approveServiceProvider)

//Api to reject service provider request
router.delete('/reject/serviceProvider/request',approvedServiceProvider.rejectServiceProviderReq)

//Api to get all approved service providers
router.get('/approvedServiceProviders/list',approvedServiceProvider.allServiceProviders)

//Service Provider login
router.post('/serviceProvider/login',approvedServiceProvider.serviceProviderLogin)

//service provider attendence
router.post('/serviceProvider/attendence',approvedServiceProvider.serviceProviderAttendance)

//Api to get all attendence list inside the admin dashboard
router.get('/service-providers/attenedence',adminController.getAllAttendence)

//Api to send service provider leave request
router.post('/serviceProvider/leave-request',approvedServiceProvider.leaveRequest)

//Api to get all leave req
router.get('/request/leave-request',adminController.getAllLeaveReq)

//Api to reject leave request
router.post('/leave-request/reject',adminController.rejectLeaveReq)

//Api to Accept leave request
router.post('/leave-request/accept',adminController.acceptLeaveReq)

//Api to add blog
router.post('/blogs/add-blogs',uploadPDF.single('image'),adminController.addBlogs)

//Api to get all blogs added
router.get('/blogs/all-blogs',adminController.getAllBlogs)

//Api to view blogs individually
router.get('/blogs/view-blog/:id',adminController.viewBlog)

//Api call to delete blog
router.delete('/blog/delete-blog',adminController.deleteBlog)

//Api to add webinar
router.post('/webinar/add-webinar',uploadPDF.single('image'),adminController.addWebinar)

//Api to view webinar
router.get('/webinar/all-webinar',adminController.getAllWebinar)

//Api to view singe webinar
router.get('/webinar/view-webinar/:id',adminController.viewWebinar)

//Api call to delete webinar
router.delete('/webinar/delete-webinar',adminController.deleteWebinar)

//Api to search service provider
router.post('/search/service-provider',userController.searchServiceProvider)

//Api for primary serviceProvider Booking
router.post('/service-provider/primary-booking',userController.PrimaryBooking)

//Api to get user bookings in service provider dashboard
router.get('/bookings/user-bookings',approvedServiceProvider.getUserBookings)

//Api to get service provider own attendence
router.get('/attendence/serviceProvider',approvedServiceProvider.getAttendence)

//Api to accept user booking by service provider
router.post('/userBooking/serviceProvider/accept',approvedServiceProvider.acceptBooking)

//Api to reject user booking by service provider
router.post('/userBooking/serviceProvider/reject',approvedServiceProvider.rejectBooking)

//Api to get service provider accepted bookings inside admin dashboard
router.get('/bookings/accepted-bookings',adminController.getAcceptedBooking)

//Api to get service provider accepted bookings inside admin dashboard
router.get('/bookings/rejected-bookings',adminController.getRejectedBooking)

//Api to add reviews
router.post('/review/add-review',userController.addReview)

//Api to view reviews
router.get('/reviews/view-reviews/:id',userController.getReviews)

//Api to post chat
router.post('/user/sendchat',chats.sendMessage)

//Api to get chat
router.get('/getMessages/:userId1/:userId2',chats.getMessages);

//Api to approve booking by admin
// approved booking by admin
router.post('/maternalcare/admin/primarybooking/accept',adminController.confirmBooking)

// payment and confirm booking
router.post('/maternalcare/primarybooking/user/payment/view',userController.payment)

//get unpaid bill on userPage
router.get('/maternalcare/primarybooking/billunpaid/view',userController.getUnpaidBill)

//Api to all service providers from readytobook
router.get('/serviceProviders/allServiceProviders',userController.getAllServiceProviders)

//Api to get transaction history of user
router.get('/history/transaction-history',userController.getPaymentHistory)

//Api to get all transactions details
router.get('/transactions/alltransactions',adminController.allTransactions)

//Api call to get user paid bills
router.get('/user/paid-bills',userController.userPaidBills)

//Api to update pic
router.post('/update/profile-pic',uploadImg.single('profile_img'),approvedServiceProvider.updateProfilePic)

//Api to add main category
router.post('/category/main-category',mainCategoryController.addMainCategory)

//Api to get main categories
router.get('/get/main-categories',mainCategoryController.getMainCtegory)

//Api to delete category
router.delete('/delete/main-category',mainCategoryController.deleteCategory)

//Api to add subcategory
router.post('/add-subcategory/category',mainCategoryController.addSubcategory)

//Api to add emergency support
router.post('/emergency/add-emergency',mainCategoryController.addEmergency)

//Api to get emergency
router.get('/emergency/allEmergency',mainCategoryController.getEmergency)

//Apin to get all chats
router.get('/complaints/chats',chats.getAllMessage)

//4) export routes
module.exports=router

