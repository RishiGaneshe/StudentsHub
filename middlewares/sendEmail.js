require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const OTP= require('../models/otp.js')


sgMail.setApiKey('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');



async function sendContactEmail(req,res,next){
    try{
        const {name,emaillll,message}= req.body
        const msg = {
            to: 'studenthub33@gmail.com',
            from: 'rishiganeshe33@gmail.com',
            subject: 'User Side Contact',
            text: message +' By '+name
            }
         
            try {
                await sgMail.send(msg);
                console.log('User Send Email');
            } catch (error) {
                console.error('Error in Sending Email to Server', error);
            }
            next();

    }catch(err){
            console.log(err)
            res.status(500).render('Error500')
    }
}



async function sendForgetPassOtp(email,otp){
    try{
        const sendOTP = async (to, otp) => {
            const msg = {
            to: to,
            from: 'rishiganeshe33@gmail.com',
            subject: 'Your OTP Code for reseting Password. Please do not share this OTP with anyone',
            text: `Your OTP is: ${otp}`,
            }
         
            try {
                await sgMail.send(msg);
                console.log('OTP sent successfully');
                const newotp= new OTP({email,otp})
                const result=await newotp.save();
        
            } catch (error) {
                console.error('Error sending OTP:', error);
            }
         }
         sendOTP(email, otp);    
         
    }catch(err){
        console.log(err)
    }
}



module.exports={
    sendContactEmail,
    sendForgetPassOtp
}
