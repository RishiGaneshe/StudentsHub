const mongoose= require('mongoose')


const imageSchema= mongoose.Schema({
    name: { type: String, require: true },
    image: { data:Buffer, contentType: String},
    user_name: { type: String, require: true },
    path: { type:String, require:true}
})

const image= mongoose.model('image',imageSchema)


module.exports= image;