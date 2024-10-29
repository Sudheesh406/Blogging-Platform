const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type :String,
        enum:['User','admin'],
        default:'User'
    }
})

const User = mongoose.model("user",userSchema) 
module.exports = User
