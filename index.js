import { render } from "ejs";
import express from "express";
import path from "path"
import cookieParser from "cookie-parser";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"backend"
})
.then(()=>console.log("database connected"))
.catch((e)=>console.log(e))

// schema pre define what data came in database
// const messageSchema = new mongoose.Schema({
//     name:String,
//     email:String,
// });
// add module = collection 
// const Messge = mongoose.model("Message",messageSchema)

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
});
// add module = collection 
const User = mongoose.model("User",userSchema)

const app = express();

// const users = [];

//using middlewares
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(path.resolve(),"public")));
// express.static(path.join(path.resolve(),"public")) // resolve = to find current directory
// middleware not directly use - using app.use to acces middleware

app.set("view engine","ejs");

app.get("/index",(req,res)=>{
    // res.send("hiii");
    // res.sendStatus(404); // 400 , 500 
    // res.status(400).send("Bad Request or What!!!");
    // res.json({
    //     success:true,
    //     product:[],
    // })
    // const pathlocation = path.resolve();
    // res.sendFile(path.join(pathlocation,"./index.html"));
     // res.sendFile("index.html")
    res.render("index",{name:"dhruv"});
});
 
const isAuthenticated = async(req,res,next)=>{
    const token = req.cookies.token; 
    if(token){
        const decoded = Jwt.verify(token,"sdafygayduf")
        // console.log(decoded)
        req.user = await User.findById(decoded._id)
        next();
    }
    else{
        res.redirect("/login")
    }
}

app.get("/",isAuthenticated,(req,res)=>{ // next - isAuthenticated if condition true then call next argument/handlers res.render("logout")
    // console.log("req.user")
    res.render("logout",{name:req.user.name})
    // console.log(req.cookies.token)
    // const token = req.cookies.token; 
    // if(token){
    //     res.render("logout")
    // }
    // else{
    //     res.render("login")
    // }
})

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    let user = await User.findOne({email}); 
    if(!user) return res.redirect("/register");
    // const isMatch = user.password === password;
    const isMatch = bcrypt.compare(password, user.password);
    if(!isMatch) return res.render("login",{email,message:"incorrect password"});
    const token = Jwt.sign({_id:user._id},"sdafygayduf");
    res.cookie("token", token ,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000),
    });
    res.redirect("/");

});

app.post("/register",async(req,res)=>{
    // console.log(req.body)
    const {name,email,password} = req.body;
    let user = await User.findOne({email});
    if(user){
        return res.redirect("/login")
    }

    const hashedPassword = await bcrypt.hash(password,10);

    user = await User.create({
        name,
        email,
        password:hashedPassword,
    });

    const token = Jwt.sign({_id:user._id},"sdafygayduf");
    // console.log(token)
    res.cookie("token", token ,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000),
    });
    res.redirect("/");
})

app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly:true,
        expires:new Date(Date.now()),
    });
    res.redirect("/");
})
// app.get("/add",async(req,res)=>{

//     await Messge.create({name:"dhruv2",email:"sample2@gmail.com"})
//         res.send("nice"); 
//    }); 

// app.get("/success",(req,res)=>{
//  res.render("success");
// });
// app.post("/form",async(req,res)=>{
//     // const messageData = { usersname: req.body.name, email: req.body.email };
//     // console.log(messageData);
//     const {name,email} = req.body;
//     await Messge.create({ name: name, email: email });
//     res.redirect("/success");
// });
// app.get("/users",(req,res)=>{
//     res.json({
//         users,
//     })
// })

app.listen(5000,()=>{
    console.log("server is working")
});