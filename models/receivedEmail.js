const mongoose= require('mongoose')


const receivedEmail= new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
})

const emails= mongoose.model('receivedEmail',receivedEmail)


module.exports= emails