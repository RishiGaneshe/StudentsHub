const express= require('express')
const router= express.Router();
const Admin= require('../controllers/admin.js')



router.get("/",Admin.handleGetAdminHomePage)

router.get("/data-form",Admin.handleGetDataForm)

router.get("/logout",Admin.handleGetLogout)

router.get("/modify",Admin.handleGetModifyPage)

router.get("/user-profile",Admin.handleGetUpdateUserDataPage)

router.get("/change-password",Admin.handleGetChangePasswordPage)

router.get("/change-email",Admin.handleGetUpdateEmailPage)

router.get("/image",Admin.handleGetImageUploadPage)

router.post("/change-email",Admin.handlePostEmailChange)

router.post("/image-upload",Admin.handleImageUpload)

router.post("/alluser",Admin.handleGetAllUsers)

router.post("/change-password",Admin.handlePostChangePassword)

router.post("/user-profile",Admin.handlePostUpdateUserData)

router.post("/submit-form",Admin.handlePostData)

router.post("/modify",Admin.handleAllSubjectDataModify)

router.post("/modify/update",Admin.handlePostUpdateData)




module.exports= router

// 