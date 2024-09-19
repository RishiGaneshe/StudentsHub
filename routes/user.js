const express= require('express')
const router= express.Router()
const User= require('../controllers/user.js')
const {emailAuthentication}= require('../middlewares/emailService.js')
const emails= require('../middlewares/sendEmail.js')
const {loginLimiter}= require('../middlewares/loginRateLimiter.js')



router.get("/",User.handleGetHomePage)

router.get("/about",User.handleGetAboutPage)

router.get("/contact",User.handleGetContactPage)

router.get("/login",User.handleGetLoginPage)

router.get("/ourteam",User.handleGetOurteamPage)

router.get("/notes",User.handleGetNotesPage)

router.get("/newdata/:id",User.handleGetNotes)

router.get("/signup",User.handleEmailSignUp)

router.get("/forget-password",User.handleGetForgetPasswordPage)

router.post("/forget-password/change",User.handlePostForgetPassChange)

router.post("/forget-password",User.handlePostForgetPasswordOtp)

router.post("/login",loginLimiter,User.handleUserLogin)

router.post("/signup",emailAuthentication,User.handleUserSignup)

router.post("/signup/otp",User.handleUserOtp)

router.post("/post-message",emails.sendContactEmail,User.handlePostContactForm)




module.exports= router