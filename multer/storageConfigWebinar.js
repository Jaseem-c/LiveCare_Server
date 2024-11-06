const multer =require('multer')

//storage
const webinarstorage=multer.diskStorage({

    destination:(req , file ,callback)=>{

        callback(null,'./UploadWebinarImg')
    },
    filename:(req,file,callback)=>{
        callback(null,`file-${Date.now()}-${file.originalname}`)
    }
})

//file filtering

const webinarfileFilter=(req,file,callback)=>{
    if(file.mimetype=='image/png'|| file.mimetype=='image/jpg'|| file.mimetype=='image/jpeg'){
        callback(null,true)
    }
    else{
        callback(null,false)
        return callback(new Error('only accept png or jpg or jpeg type files'))
    }
}

//define upload-*
const UploadWebinarImage = multer({storage:webinarstorage,fileFilter:webinarfileFilter})

module.exports= UploadWebinarImage