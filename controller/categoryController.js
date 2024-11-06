const Category=require('../model/mainCategorySchema')
const emergency=require('../model/emergencySchema')
//Logic  to add main category
exports.addMainCategory=async(req,res)=>{
    console.log('inside api call to add main category')
    const {mainCategory}=req.body
    try {
        const category=await Category.findOne({mainCategory})
        if(category){
            res.status(400).json({message:'category already exist'})
        }else{
            const newCategory=new Category({
                mainCategory
            })
            await newCategory.save()
            res.status(200).json({newCategory,message:"category added succesfully"})
        }


        
    } catch (error) {
        res.status(500).json({ error: 'internal server error' });
    }
}

//Logic to get main category
exports.getMainCtegory=async(req,res)=>{
    const{mainCategory}=req.body
  console.log('inside api call to get main category')
  try {
    const findCategory=await Category.findOne({mainCategory})
    if(findCategory){
     res.status(200).json({findCategory,message:'List of main-categories'})
    }else{
        res.status(400).json({message:'Main category not found'})
    }

    
  } catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
}

//Logic to delete main category
exports.deleteCategory=async(req,res)=>{
    console.log('inside api call to delete main category')
    const {id}=req.body
    try {
        const deleteReq=await Category.deleteOne({_id:id})
        if(!deleteReq){
            res.status(404).json({message:'category not found'})
        }
        res.status(200).json({message:'Main category deleted'})
    } catch (error) {
        res.status(500).json({ error: 'internal server error' });  
    }
}

//Logic to add subcategory
//subcategory add

exports.addSubcategory= async (req,res)=>{
    const {mainCategory,sub_category}=req.body
console.log(mainCategory,sub_category);
    try {
        console.log("try");
        const existCategory = await Category.findOne({mainCategory})

if(existCategory){

    existCategory.subCategory.push({subcategory: sub_category})
    await existCategory.save(); 
    res.status(200).json({mainCategory,message: " subcategory added successfully"})
}

else{
    res.status(400).json({message:"main category not found. please add main category"})

}
        
    } catch (error) {
        res.status(500).json({error, message:"server error"})
 
    }
}

//Logic to add emergency
exports.addEmergency=async(req,res)=>{
    console.log('inside api call to add emergency')
    const {emergency_support,location,phonenumber}=req.body
    try {
        const exist_emergency=await emergency.findOne({emergency_support,location,phonenumber})
        if(exist_emergency){
            res.status(400).json({message:'emergency already exist'})
        }else{
            const newEmergency=new emergency({
                emergency_support,
                location,
                phonenumber
            })
            await newEmergency.save()
            res.status(200).json({newEmergency,message:"Emergency support added."})
        }
        
    } catch (error) {
     res.status(500).json({error, message:"server error"}) 
    }
}

//Logic to get emergency
exports.getEmergency=async(req,res)=>{
    console.log('inside api call to get emergency')
    try {
        const getAllEmergency=await emergency.find()
        res.status(200).json({getAllEmergency,message:'Emergency Fetched'})
        
    } catch (error) {
        res.status(500).json({error, message:"server error"})  
    }
}