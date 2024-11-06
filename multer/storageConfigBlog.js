const multer =require('multer')

//storage
const blogstorage=multer.diskStorage({

    destination:(req , file ,callback)=>{

        callback(null,'./UploadblogImage')
    },
    filename:(req,file,callback)=>{
        callback(null,`file-${Date.now()}-${file.originalname}`)
    }
})

//file filtering

const blogfileFilter=(req,file,callback)=>{
    if(file.mimetype=='image/png'|| file.mimetype=='image/jpg'|| file.mimetype=='image/jpeg'){
        callback(null,true)
    }
    else{
        callback(null,false)
        return callback(new Error('only accept png or jpg or jpeg type files'))
    }
}

//define upload-*
const UploadblogImage = multer({storage:blogstorage,fileFilter:blogfileFilter})

module.exports= UploadblogImage