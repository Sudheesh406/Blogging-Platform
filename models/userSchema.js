const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
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

const User = mongoose.model("User",userSchema) 
module.exports = User
