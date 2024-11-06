const multer =require('multer')

//storage
const imagestorage=multer.diskStorage({

    destination:(req , file ,callback)=>{

        callback(null,'./uploadImage')
    },
    filename:(req,file,callback)=>{
        callback(null,`image-${Date.now()}-${file.originalname}`)
    }
})

//file filtering

const imagefileFilter=(req,file,callback)=>{
    if(file.mimetype=='image/png'|| file.mimetype=='image/jpg'|| file.mimetype=='image/jpeg'){
        callback(null,true)
    }
    else{
        callback(null,false)
        return callback(new Error('only accept png or jpg or jpeg type files'))
    }
}

//define upload
const uploadImg = multer({storage:imagestorage,fileFilter:imagefileFilter})

module.exports= uploadImg