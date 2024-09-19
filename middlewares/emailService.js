require('dotenv').config();
const crypto= require('crypto')
const OTP= require('../models/otp.js')
const sgMail = require('@sendgrid/mail');
const UserData= require('../models/userData.js');


sgMail.setApiKey(process.env.EMAIL_API_KEY);


async function emailAuthentication(req,res,next){
  try{
     const {email}=req.body;
     if(!email)  { return res.status(403).end('Email is required')}
     const mails= [
          "ipsacademy.org"
     ]
     const domain= email.substring(email.lastIndexOf("@")+1)
     const tempMail=mails.includes(domain.toLowerCase());

     if(!tempMail) { return res.status(400).render('signUp',{error:'This email is Temporary and from untrusted domains'}) }  
    
     const user= await UserData.findOne({email})
     if(user) { return  res.status(400).render('signUp',{error:'This Email is already used'}) }
     
     const otp= crypto.randomInt(100000,999999).toString();
     const sendOTP = async (to, otp) => {
          const msg = {
            to: to,
            from: 'rishiganeshe33@gmail.com',
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`,
          };
      
          try {
              await sgMail.send(msg);
              console.log('OTP sent successfully');
              const newotp= new OTP({email,otp})
              await newotp.save();
          } catch (error) {
              console.error('Error sending OTP:', error);
          }
      }

      sendOTP(email, otp);    
      next();
    }
  catch(err){
         console.log(err)
         res.status(500).render('Error500')
  }
}


module.exports= {
    emailAuthentication,
}


