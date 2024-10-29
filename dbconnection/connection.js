const mongoose = require('mongoose');

let userdetailDb = ()=>{
    try{
    mongoose.connect("mongodb://localhost:27017/userdetails");
    console.log('mongodb connected');
    }catch (err){
        console.error(err);
        
    }
}

module.exports = {userdetailDb}  // connecting database the name workers