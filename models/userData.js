const mongoose= require('mongoose')


const userDataSchema= new mongoose.Schema({
    name:{ type:String},
    username:{ type:String, require:true, unique:true},
    email:{ type:String, require:true, unique:true},
    phone:{ type:String,unique:true},
    profession:{ type:String},
    address:{ type:String}
})

const userData= mongoose.model('user',userDataSchema)


module.exports= userData