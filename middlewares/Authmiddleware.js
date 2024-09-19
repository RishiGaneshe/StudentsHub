const crypto= require('crypto')
const fs= require('fs')
const {sessionStore} = require('../controllers/user')



async function handleUserVarification(req,res,next){
    try{
        const sessionId= req.cookies.session_id
        if(sessionId && sessionStore[sessionId]){
            req.session = sessionStore[sessionId]
            next();
        }else{
            res.status(401).render('Error401')
        }
    }catch(err){
        console.log(err)
        res.status(500).render('Error500')
    }
}


module.exports={
    handleUserVarification,
}