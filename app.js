const connection = require('./dbconnection/connection.js')
const user = require('./models/userSchema')
const express = require("express")
const app = express()
const path = require("path")
const userRoute = require('./routes/userRout')
const cookieParser = require("cookie-parser")

connection.userdetailDb()

 app.use(express.static(path.join(__dirname,'public')))
 app.use(express.json());
 app.use(express.urlencoded({extended:false}))

 app.set("view engine","ejs")
 app.set("views",path.join(__dirname,"views"))
 app.use(cookieParser())

 app.use('/',userRoute)

 app.listen(3000, (err) => {
     if(err){
   console.log(err,"error found...");
     }else{
         console.log("server is running on 3000..."); 
     }
 });
 