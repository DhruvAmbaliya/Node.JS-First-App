import fs from "fs"; // file read write
import path from "path";
// build server
// const http = require("http");
import http from "http" // for this chage in package.json type = module
// const name = require("./features")
// import name,{ name2,name3 } from "./features.js" 
import * as myObj from "./features.js";
import {newObj} from "./features.js"
console.log(newObj());
// console.log(myObj);
console.log(myObj.default);
// console.log(name2);
// console.log(name3);

const home = fs.readFileSync("./index.html");

const server = http.createServer((req,res)=>{

    console.log(req.method);
    //routing
    if(req.url === "/"){
        res.end(home);
    }
    else if(req.url === "/about"){
        res.end(`<h1>about love is ${newObj()} </h1>`);
    }
    else{
        res.end("<h1>page not found</h1");
    }

    // res.end("<h1>hello</h1>")
    // console.log(req.url);
    // console.log("server is running")
})

server.listen(5000,()=>{
    console.log("server is working")
})

// console.log(http)
// console.log("hieeee")
