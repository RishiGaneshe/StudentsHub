const crypto= require('crypto')
const OTP= require('../models/otp.js')
const Data= require('../models/data.js')
const User= require('../models/user.js')
const Image= require('../models/image.js')
const sanitizeHTML= require('sanitize-html')
const UserData= require('../models/userData.js')
const PassHash= require('../services/passHashing.js')
const receivedEmail= require('../models/receivedEmail.js')
const Email= require('../middlewares/sendEmail.js')
const {generateCaptcha}= require('../services/generateCaptcha.js')



const sessionStore = {};
let captchaStore = {};


async function handleUserLogin(req,res){
    const {username,password,captchaInput}= req.body
    try{    
        if(!username || !password) { 
            const captcha= await generateCaptcha()
            captchaStore[req.ip]= captcha
            return res.status(404).render('login',{error:'Both fields are required',captcha:captcha})  }

        if(!captchaInput)  { 
            const captcha= await generateCaptcha()
            captchaStore[req.ip]= captcha
            return res.status(404).render('login',{error:'Unable to Submit Username and Password(No Captcha Provided)',captcha:captcha})  }


        const captcha= captchaStore[req.ip]
        if(!(captcha && captchaInput === captcha))  { 
            const captcha= await generateCaptcha()
            captchaStore[req.ip]= captcha
            return  res.status(404).render('login',{error:'Unable to Submit Username and Password',captcha:captcha})  }

        const user= await User.findOne({username}) 
            if(!user) {
                const captcha= await generateCaptcha()
                captchaStore[req.ip]= captcha
                return res.status(400).render('login',{error:'Invalid Username Or Password',captcha:captcha})  }

        const match= await PassHash.verifyPassword(password,user.password)
            if(!match){
                const captcha= await generateCaptcha()
                captchaStore[req.ip]= captcha
                return res.status(400).render('login',{error:'Invalid Username Or Password',captcha:captcha})  }

        sessionId = crypto.randomBytes(48).toString('hex');
        sessionStore[sessionId] = {username}
        res.cookie('session_id',sessionId,{
                sameSite:'Strict',                          // to protect CSRF attack
                httpOnly: true,                             // true if only accessible by web browsers
                secure: false,                              // true if only send over HTTPs connection 
                maxAge: 60 * 60 * 1000                      // 1 hour in milliseconds
        })
        await delete captchaStore[req.ip];
        console.log(username+" logged-In")
        res.status(200).redirect("/admin")

    }catch(err){
        console.log(err)
        res.status(500).render('Error500')
    }
}


async function handleUserSignup(req,res){
     try{
        res.status(200).render('userSignUp');
     }catch(error){
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).render('signUp',{error:'problem in creating user'});
        }
        if (error.code === 11000) {         // MongoDB duplicate key error code
            return res.status(409).render('signUp',{error:'This Email is already used'});
        }
        res.status(500).render('Error500')
     }
}


async function handleEmailSignUp(req,res){
     try{
          res.status(200).render('signUp',{error:null})
     }catch(err){
          console.log(err)
          res.status(500).render('Error500')
     }
}


async function handleUserOtp(req,res){
    try{
        const {username,password,email,phone,otp}= req.body
        if(!username || !password || !email ) return res.end("all feilds are required")

        if(!email || !otp ) {return res.status(400).json({msg:"email(identifier) and otp required"})}
        const storedOtp= await OTP.findOne({email,otp}) 

        if(storedOtp){
            const hashedPassword= await PassHash.hashPassword(password)

            const result= await UserData.create({
                username:sanitizeHTML(username),
                email:sanitizeHTML(email),
                phone:sanitizeHTML(phone)
            }).then(()=>{
                const result01= User.create({
                    username:sanitizeHTML(username),
                    password:sanitizeHTML(hashedPassword),
                }).then(()=>{console.log("New user created")}).catch((err)=>{console.log("Error in creating user",err)})
            })
            
            const newImage= new Image ({
                name: 'undefine',
                user_name: username,
                path: 'Image/blue-user-icon-32.jpg',
                image: {
                     data: 'undefine',
                     contentType: 'image/png/jpeg'
                }
           })
           await newImage.save().then(()=>{console.log("File/Image uploaded successfully by user "+username)})

            OTP.deleteOne({email,otp}).then(()=>{console.log("OTP cleared from database")})
            
            res.status(200).render('afterUserCreate')
        }else{
            res.status(404).end("Invalid or Expired OTP")
        }

    }catch(err){
         console.log(err)
         res.status(500).render('Error500')
    }
}


async function handleGetHomePage(req,res){
    try{
        res.status(200).render('index')
    }catch(err){
        console.log("Error in sending Home page",err)
        res.status(404).render('Error404')
    }
}


async function handleGetAboutPage(req,res){
    try{
         res.status(200).render("about")
    }catch(err){
         console.log("error in sending About page",err)
         res.status(404).render('Error404')
    }
}


async function handleGetContactPage(req,res){
    try{
        res.status(200).render('contact')
    }catch(err){
        console.log("error in sending Contact page",err)
        res.status(404).render('Error404')
    }
}


async function handleGetLoginPage(req,res){
    try{
        const captcha= await generateCaptcha()
        captchaStore[req.ip]= captcha
        res.status(200).render('login',{error:null,captcha:captcha})
    }catch(err){
        console.log("error in sending Login page",err)
        res.status(404).render('Error404')
    }
}


async function handleGetOurteamPage(req,res){
    try{
        res.status(200).render('ourteam')
    }catch(err){
       console.log("error in sending Login page",err)
       res.status(404).render('Error404')
    }
}


async function handleGetNotesPage(req,res){
    try{
        res.status(200).render('search')
    }catch(err){
        console.log("error in sending Notes page",err)
        res.status(404).render('Error404')
    }
}


async function handleGetNotes(req,res){
    try{
        const id=req.params.id
        const result= await Data.findOne({id:id})
        res.status(200).json(result)
    }catch(err){
        console.log(err)
        res.status(404).render('Error404')
    }
}



async function handleGetForgetPasswordPage(req,res){
    try{
        res.status(200).render('adminForgetPass',{error:null})
    }catch(err){
        console.log(err)
        res.status(500).render('Error500')
    }
}


async function handlePostContactForm(req,res){
     try{
            const {name,emaillll,message}= req.body   
            const result= await receivedEmail.create({
                name:sanitizeHTML(name),
                email:sanitizeHTML(emaillll),
                message:sanitizeHTML(message)
            }).then(()=>{console.log('email stored in data base')}).catch((err)=>{console.log(err)})

            res.status(200).redirect('/')

     }catch(err){
            console.log("error in sending email",err)
            res.status(404).render('Error500')
     }
}



async function handlePostForgetPasswordOtp(req,res){                 // on working *
    try{
         const {email,username}= req.body
         const result= await UserData.findOne({username:username,email:email})
           if (!result){ return res.status(400).render('adminForgetPass',{error:"No user with provided email and username"})}
         const otp= crypto.randomInt(100000,999999).toString();
         await Email.sendForgetPassOtp(email,otp);

         res.status(200).render('adminOtp',{error:null,email:email})
    }catch(err){
         console.log(err)
         res.status(500).render('Error500')
    }
}


async function handlePostForgetPassChange(req,res){
    try{
        const {otp,email,confirmPassword,newPassword}= req.body
        const result3= await OTP.findOne({email:email,otp:otp})
            if(!result3){
                return res.status(400).render('adminOtp',{error:'Invalid OTP',email:email});
            }

            if(!(newPassword===confirmPassword)){
                return  res.status(404).render('adminOtp',{error:'Enter Same Password At Both Fields',email:email});
            }

            const result01= await UserData.findOne({email:email})
            const username= result01.username
            const user= await User.findOne({username:username})
              if (!user){ return res.status(400).send("NO User Present")}

            const hashedPassword= await PassHash.hashPassword(newPassword)
            console.log("An attemp made by user "+username+" to change password")
            const filter= {username:username}
            const update= { $set:{password:hashedPassword}}

            const result= await User.updateOne(filter,update)

                   if(result){
                        if (result.matchedCount === 0) {
                             return res.status(404).render('adminForgetPass',{error:'Problem In Changing Password'});
                        }else if(result.modifiedCount===0){
                             return res.status(200).render('login',{error:'Password Changed Successfully'});
                        }else {
                             console.log("Password changed Successfully by user "+username)
                             return res.status(200).render('login',{error:'Password Changed Successfully'});
                        }
                   }else{
                        console.log("Error in password changed")
                        return res.status(404).render('adminForgetPass',{error:'Problem In Changing Password'});
                   }

    }catch(err){
        console.log(err)
        res.status(500).render('Error500')
    }
}



module.exports={
    handleGetHomePage,
    handleGetAboutPage,
    handleGetContactPage,
    handleGetLoginPage,
    handleGetOurteamPage,
    handleGetNotesPage,
    handleGetNotes,
    handleUserLogin,
    handleUserOtp,
    handleUserSignup,
    handleEmailSignUp,
    handlePostContactForm,
    handleGetForgetPasswordPage,
    handlePostForgetPasswordOtp,
    handlePostForgetPassChange,
    sessionStore,
}