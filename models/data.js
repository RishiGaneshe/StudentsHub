const mongoose= require('mongoose')

const dataSchema= mongoose.Schema({
    name:{ type:String, required:true},
    id:{ type:String, required:true, unique:true},
    Sub_Syl:[String],
    previousY:{type:String},
    module1:{type:String},
    module2:{type:String},
    module3:{type:String},
    module4:{type:String},
    module5:{type:String},
    module1_url:{type:String},
    module2_url:{type:String},
    module3_url:{type:String},
    module4_url:{type:String},
    module5_url:{type:String},
    book_image:[String],
    book_url:[String]

})

const data= mongoose.model('Data',dataSchema)

module.exports=data;