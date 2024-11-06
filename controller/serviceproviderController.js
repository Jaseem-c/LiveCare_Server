//1) import serviceProvider  model
const serviceProvider=require('../model/serviceproviderSchema')

//logic for primary  serviceProvider registeration
exports.serviceProviderRegisteration=async(req,res)=>{
    
    const exp_crt=req.file.filename
    const newExp=`http://localhost:5000/uploadCertificate/${exp_crt}`
    // const img=req.file.filename
    // console.log(exp_crt);
    // console.log(img);
    const {username,email,password,mobile,service,specialization,qualification,exp_year,rate,location}=req.body
    try{
        const existingUser=await serviceProvider.findOne({email:email});
        if(existingUser){
            res.status(400).json({message:'Account already exist'}) 
        }else{
            const newUser=new serviceProvider({
                username,email,password,mobile,profile_img:'',service,specialization,experience_crt:newExp,qualification,exp_year,rate,location
            });
            await newUser.save();
            res.status(200).json({newUser,message:'primary registeration completed'})

        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal server error'})
    }
}

//Logic for secondary serviceProvider registration
exports.finalReg=async(req,res)=>{
    const img=req.file.filename
    const newImg=`http://localhost:5000/uploadImage/${img}`
    const {email}=req.body
    try{
        const existingUser=await serviceProvider.findOne({email:email})
        if(!existingUser){
            res.status(400).json({message:'primary registeration faild'})
        }else{
            const filter={email};
            const update={
                $set:{
                    profile_img:newImg
                }
            }
            const result=await serviceProvider.updateOne(filter,update)
            console.log(result);

            if(result.modifiedCount==1){
                const preUser=await serviceProvider.findOne({email})
                res.status(200).json({preUser,message:'Photo succesfully uploaded'})
            }else{
                res.status(400).json({message:'Photo upload faild'})
            }
        }

    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal server error'})
    }
}
