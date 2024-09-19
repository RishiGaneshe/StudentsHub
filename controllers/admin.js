const multer= require('multer')
const validator = require('validator')
const Data= require('../models/data.js')
const User= require('../models/user.js')
const Image= require('../models/image.js')
const sanitizeHTML= require('sanitize-html')
const { sessionStore } = require('./user.js')
const UserData= require('../models/userData.js')
const PassHash= require('../services/passHashing.js')


const storage= multer.diskStorage({
     destination: function(req,file,cb){
          return cb (null,'./pages/uploads')
     },
     filename: function(req,file,cb){
          return cb (null,`${Date.now()}-${file.originalname}`)
     }
})
const upload= multer({storage:storage}).single('profilePic')


async function handleGetDataForm(req,res){                              // Get on  /admin/data-form
     try{
          res.status(200).render('dataSubmit_form',{error:null})
     }catch(err){
          console.log("Error in sending form",err)
          res.status(404).render('Error404')
     }
}


async function handleGetUpdateUserDataPage(req,res){                     // GET on  /admin/user-profile
     try{
           const username=sessionStore[sessionId].username

           const isValidUsername = /^[a-zA-Z0-9_-]{3,16}$/.test(username);
           if (!isValidUsername ) return res.status(400).send('Invalid Username format');  

           const data=await UserData.findOne({username:{ $eq: username }})
           res.render('userdata',{data:data,error:null})
     }catch(err){
           console.log(err)
           res.status(500).render('Error500')
     }
}


async function handleGetModifyPage(req,res){
     try{
          res.status(200).render('adminModify',{error:null})
     }catch(err){
          console.log(404)
          console.log("Error in sending form",err)
          res.status(404).render('Error404')
     }
}


async function handleGetAdminHomePage(req,res){                           // GET on /admin
     try{ 
          const username=sessionStore[sessionId].username

          const isValidUsername = /^[a-zA-Z0-9_-]{3,16}$/.test(username);
          if (!isValidUsername ) return res.status(400).send('Invalid Username format');  

          const data=await UserData.findOne({username:{ $eq: username }})
          const image= await Image.findOne({user_name:{ $eq: username }})
          const path= image.path
          res.status(200).render('adminHome',{data:data,path:path,error:null})
     }catch(err){
          console.log(err)
          res.status(404).render('Error404')
     }
}


async function handleGetImageUploadPage(req,res){
     try{
          res.status(200).render('adminImage',{error:null})
     }catch(err){
          console.log(err)
          res.status(404).render('Error404')
     }
 }


async function handleGetAllUsers(req,res){                                // GET on /admin/alluser
     try{  
           const username=sessionStore[sessionId].username

           const isValidUsername = /^[a-zA-Z0-9_-]{3,16}$/.test(username);
           if (!isValidUsername ) return res.status(400).send('Invalid Username format');  

           const data=await UserData.findOne({username:{ $eq: username }})
           res.status(200).json(data)
     }catch(err){
          console.log(err)
          res.status(404).render('Error404')
     }
}


async function handleGetChangePasswordPage(req,res){
     try{
         res.status(200).render('adminChangePass',{error:null})
     }catch(err){
         console.log(err)
         res.status(404).render('Error404')
     }
}


async function handleGetUpdateEmailPage(req,res){
     try{
         res.status(200).render('adminUpdateEmail',{error:null})
     }catch(err){
          console.log(err)
          res.status(404).render('Error404')
     }
 }


//        POST Request Functions

async function handlePostData(req,res){                                 // POST on  /admin/submit-form
     const{ name, id, previousY, module1, module2, 
          module3, module4, module5, module1_url, module2_url,
          module3_url, module4_url, module5_url, 
          } = req.body     
     try{
          const username=sessionStore[sessionId].username
          const Sub_Syl=req.body['Sub_Syl[]']
          const book_image=req.body['book_image[]']
          const book_url=req.body['book_url[]']

          const Sub_Syl_Arr=[sanitizeHTML(Sub_Syl[0]),sanitizeHTML(Sub_Syl[1]),sanitizeHTML(Sub_Syl[2]),sanitizeHTML(Sub_Syl[3]),sanitizeHTML(Sub_Syl[4])]                     // input sanatising URLs present in arrays 
          const book_image_Arr=[sanitizeHTML(book_image[0]),sanitizeHTML(book_image[1]),sanitizeHTML(book_image[2])]
          const book_url_Arr=[sanitizeHTML(book_url[0]),sanitizeHTML(book_url[1]),sanitizeHTML(book_url[2])]

          const newItem= new Data({
               name:sanitizeHTML(name), id:sanitizeHTML(id), 
               previousY:sanitizeHTML(previousY), module1:sanitizeHTML(module1), module2:sanitizeHTML(module2),
               module3:sanitizeHTML(module3), module4:sanitizeHTML(module4), module5:sanitizeHTML(module5),
               module1_url:sanitizeHTML(module1_url), module2_url:sanitizeHTML(module2_url), module3_url:sanitizeHTML(module3_url),
               module4_url:sanitizeHTML(module4_url), module5_url:sanitizeHTML(module5_url),
               Sub_Syl:Sub_Syl_Arr, book_image:book_image_Arr, book_url:book_url_Arr
          })
          const savedItem= await newItem.save()
          if(savedItem){ console.log("Data uploaded By User "+username)}
          res.status(200).render('dataSubmit_form',{error:'Data Submitted Successfully'})
     }catch(err){
               console.log("Error in storing data",err)
               res.status(500).render('Error500')
     }
}


async function handlePostUpdateData(req,res){                           // POST on  admin/modify/update
     try{
          const username=sessionStore[sessionId].username
          const {id,name,previousY,module1,module2,module3,module4,module5,module1_url,module2_url,module3_url,
          module4_url, module5_url}= req.body
          const Sub_Syl=req.body['Sub_Syl[]']
          const book_image=req.body['book_image[]']
          const book_url=req.body['book_url[]']
          
          const filter= {id:{ $eq: id }}
          const Sub_Syl_Arr=[sanitizeHTML(Sub_Syl[0]),sanitizeHTML(Sub_Syl[1]),sanitizeHTML(Sub_Syl[2]),sanitizeHTML(Sub_Syl[3]),sanitizeHTML(Sub_Syl[4])]                     // input sanatising of URLs present in arrays 
          const book_image_Arr=[sanitizeHTML(book_image[0]),sanitizeHTML(book_image[1]),sanitizeHTML(book_image[2]),]
          const book_url_Arr=[sanitizeHTML(book_url[0]),sanitizeHTML(book_url[1]),sanitizeHTML(book_url[2])]
          
          const update={$set:{
               previousY:sanitizeHTML(previousY), module1:sanitizeHTML(module1), module2:sanitizeHTML(module2),                                                                // sanatising and setting feilds that are gonna update
               module3:sanitizeHTML(module3), module4:sanitizeHTML(module4), module5:sanitizeHTML(module5),
               module1_url:sanitizeHTML(module1_url), module2_url:sanitizeHTML(module2_url), module3_url:sanitizeHTML(module3_url),
               module4_url:sanitizeHTML(module4_url), module5_url:sanitizeHTML(module5_url),
               book_image:book_image_Arr, Sub_Syl:Sub_Syl_Arr, book_url:book_url_Arr
          }}

          const isValidName = /^[a-zA-Z0-9_-]{3,16}$/.test(name);
          if (!isValidName ) return res.status(400).send('Invalid Name format');  
              
          const result = await Data.updateOne(filter, update)
          const subData= await Data.findOne({"name":{ $eq: name },"id":{ $eq: id }})
             if(!subData) { return res.status(404).send("No data for provided subject and id")}
               if(result){
                    if (result.matchedCount === 0) {
                         res.status(404).render('adminSubDataUpdate',{error:'No document found with the given ID',subData:subData});
                    }else if(result.modifiedCount===0){
                         res.status(200).render('adminSubDataUpdate',{error:'Data Updated Successfully',subData:subData});
                    }else {
                         console.log("Data updated Successfully by user "+username)
                         res.status(200).render('adminSubDataUpdate',{error:'Data Updated Successfully',subData:subData});
                    }
               }else{
                    console.log("No result updated")
                    res.status(500).render('adminSubDataUpdate',{error:'Error In Updataing Data for Subject',subData:subData});
               }
     }catch(err){
          console.log(err)
          res.status(500).render('Error500')
     }
}


async function handleAllSubjectDataModify(req,res){                     // POST on  /admin/modify
     try{ 
          const {name,id}=req.body

          const isValidName = /^[a-zA-Z0-9_-]{1,16}$/.test(name);
          if (!isValidName ) return res.status(400).send('Invalid Name format');  

          const subData= await Data.findOne({"name":{ $eq: name },"id":{ $eq: id }})
             if(!subData) { return res.status(404).send("No data for provided subject and id")}
          res.status(200).render("adminSubDataUpdate",{subData:subData,error:null})
          console.log("Request for Data Updation")
     }catch(err){ 
          console.log(err)
          res.status(500).render('Error500')
     }  
}


async function handlePostUpdateUserData(req,res){                         //  POST on  /admin/user-profile
     const username0= sessionStore[sessionId].username
     const {name,username,phone,profession,address}= req.body
     const isValidUsername = /^[a-zA-Z0-9_-]{3,16}$/.test(username);
     if (!isValidUsername ) return res.status(400).send('Invalid Username format');
     try{
          const filter= {username:{ $eq: username }}
          const update= {$set:{name,phone,profession,address}}
          const result= await UserData.updateOne(filter,update)
          const data=await UserData.findOne({username:{ $eq: username }})
               if(result){
                    if (result.matchedCount === 0) {
                         res.status(404).render('userdata',{data:data,error:'No Document found to Update'});
                    }else {
                         console.log("Data updated Successfully by user "+username)
                         res.status(200).render('userdata',{data:data,error:'User Data updated successfully'});
                    }
               }else{
                    res.status(404).render('userdata',{data:data,error:'No Document found to Update'});
               }
     }catch(err){
      console.log(err)
      res.status(500).render('Error500')
     }
}


async function handlePostChangePassword(req,res){                        // POST on /admin/change-password
     try{
         const username= sessionStore[sessionId].username
         const {password,newPassword,confirmPassword}= req.body
         if(!(newPassword===confirmPassword)){
              return  res.status(404).render('adminChangePass',{error:'Enter Same Password In Confirm Field'});
         }

         const user= await User.findOne({username:{ $eq: username }})
         const match= await PassHash.verifyPassword(password,user.password)
         if(match){
             const hashedPassword= await PassHash.hashPassword(newPassword)
             console.log("An attemp made by user "+username+" to change password")
             const filter= {username:{ $eq: username }}
             const update= { $set:{password:hashedPassword}}

             const result= await User.updateOne(filter,update)

                    if(result){
                         if (result.matchedCount === 0) {
                              return res.status(404).render('adminChangePass',{error:'Problem In Changing Password'});
                         }else if(result.modifiedCount===0){
                              return res.status(200).render('adminChangePass',{error:'Password Changed Successfully'});
                         }else {
                              console.log("Password changed Successfully by user "+username)
                              return res.status(200).render('adminChangePass',{error:'Password Changed Successfully'});
                         }
                    }else{
                         console.log("Error in password changed")
                         return res.status(404).render('adminChangePass',{error:'Problem In Changing Password'});
                    }
         }else{
             res.status(500).render('adminChangePass',{error:'Invalid Old Password'});
             console.log("Incorrect Old Password")
         }
 
     }catch(err){
         console.log(err)
         res.status(404).render('Error404')
     }
 }


 async function handleImageUpload(req,res){
     try{
          await new Promise((resolve,reject)=>{
           upload(req,res,(err)=>{
               if(err){
                    console.log("Error in Uploading ",err)
                    reject(res.status(500).send("Error in uploading"));
               }else{
                    const username= sessionStore[sessionId].username
                    if(!req.file.filename || !username || !req.file.path) { return reject(res.status(401).render('login',{error:'Unauthorize to access the page'}))}
                    
                    const filter= ({user_name:{ $eq: username }})
                    const update={ $set:{
                         name: req.file.filename,
                         user_name: username,
                         path: req.file.path,
                         image: {
                              data: req.file.filename,
                              contentType: req.file.mimetype || 'image/png/jpeg'
                         }
                    }}

                    try{
                         const result= Image.updateOne(filter,update).then(()=>{console.log("upload complete")}).catch((err)=>{console.log("upload failed",err)})

                         if(!result){
                              res.status(500).render('adminImage',{error:"upload failed"})
                         }
                         res.status(200).render('adminImage',{error:"Image uploaded successfully"})

                    }catch(err){
                         res.status(500).render('adminImage',{error:"upload failed"})
                         console.log(err)
                    }
                   
               }
          })
       })
     }catch(err){
          console.log(err)
          res.status(500).render('Error500')
     }
 }


 async function handlePostEmailChange(req,res){
     try{
         const {email}= req.body;

         const isValidEmail = validator.isEmail(email);
         if (!isValidUsername || !isValidEmail || !isValidOtp ) return res.status(400).send('Invalid Email format');  

         const username= sessionStore[sessionId].username
         const user= await UserData.findOne({username:{ $eq: username }})
          if(user){
              const filter= { username:{ $eq: username }}
              const update= {$set: {email:sanitizeHTML(email)}}
              try{
                    const result= await UserData.updateOne(filter,update)
                    if(result){
                        console.log("Email Updated By "+username)
                        return res.status(200).render('adminUpdateEmail',{error:'Email Updated Successfully'})
                    } 
              }catch(err){
                    if (err.code === 11000) {         // MongoDB duplicate key error code
                         return res.status(400).render('adminUpdateEmail',{error:'Email Is Already Used'})
                    }else{
                         return res.status(400).render('adminUpdateEmail',{error:'Error In Updating Email'})
                    } 
              }    
          }
     }catch(err){
          console.log(err)
          res.status(500).render('Error500')
     }
 }


async function handleGetLogout(req,res){
     try{
         const sessionId= req.cookies.session_id
         if(sessionId && sessionStore[sessionId]){
            const user=sessionStore[sessionId]
            delete sessionStore[sessionId]
            res.clearCookie('session_id')
            console.log(user.username+" logged-out")
          res.status(200).redirect('/login')
         }
     }catch(err){
          console.log(err)
          res.status(500).render('Error500')
     }
}


module.exports={
    handlePostData,
    handlePostUpdateData,
    handleGetDataForm,
    handleAllSubjectDataModify,
    handleGetModifyPage,
    handleGetAdminHomePage,
    handleGetUpdateEmailPage,
    handleGetChangePasswordPage,
    handleGetAllUsers,
    handleGetUpdateUserDataPage,
    handleGetImageUploadPage,
    handlePostUpdateUserData,
    handlePostChangePassword,
    handlePostEmailChange,
    handleImageUpload,
    handleGetLogout
}
