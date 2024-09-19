const mongoose= require('mongoose')


const userSchema= new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const user= mongoose.model('user&Pass',userSchema)


module.exports= user