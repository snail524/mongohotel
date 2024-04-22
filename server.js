// https://mongoosejs.com/ 

const http = require("http");
const Room = require("./models/room.js");
const dotenv = require("dotenv");
const mongoose = require('mongoose');

dotenv.config({path:"./config.env"})
const DB = process.env.DATABASE.replace("<password>" , process.env.DATABASE_PASSWORD)
mongoose.connect(DB)
// mongoose.connect('mongodb://localhost:27017/hotel')
    .then(()=>{
        console.log('connected database successfully');
    })
    .catch(()=>{
        console.log('connected database failed');
    })



const requestListener = async (req , res) => {
    let body = "";
    req.on("data" , chunk=>{
        body += chunk
    })
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    if(req.url=="/rooms" && req.method=="GET"){
        const rooms = await Room.find();
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status": "success",
            rooms
        }))
        res.end()
    }else if(req.url=="/rooms" && req.method=="POST"){
        req.on("end" , async()=>{
            try{
                const data = JSON.parse(body);
                console.log(data);
                const newRoom = await Room.create({
                    name: data.name,
                    price: data.price,
                    rating: data.rating
                });
                res.writeHead(200 , headers);
                res.write(JSON.stringify({
                    "status": "success",
                    rooms: newRoom
                }))
                res.end()
            }catch(e){
                console.log('err' , e);
                res.writeHead(400 , headers);
                res.write(JSON.stringify({
                    "status": "false",
                    "message": "欄位錯誤"
                }))
            }finally{
                res.end();
            }
        })
    }else if(req.url=="/rooms" && req.method=="DELETE"){
        const rooms = await Room.deleteMany();
        res.writeHead(200 , headers);
        res.write(JSON.stringify({
            "status": "success",
            rooms: []
        }))
        res.end();
    }else if(req.url.startsWith("/rooms/") && req.method==="DELETE"){
        const id = req.url.split("/").pop();
        const rooms = await Room.findByIdAndDelete(id);
        res.write(JSON.stringify({
            "status": "success",
            rooms
        }))
        res.end();
    }else if(req.url.startsWith("/rooms/") && req.method==="PATCH"){
        req.on("end" , async()=>{
            try{
                const data = JSON.parse(body);

                const id = req.url.split("/").pop();
                console.log(data);
                const newRoom = await Room.findByIdAndUpdate(id,{
                    name: data.name,
                    price: data.price,
                    rating: data.rating
                })
                res.writeHead(200 , headers);
                res.write(JSON.stringify({
                    "status": "success",
                    rooms: newRoom
                }))
                res.end();

            }catch(e){
                console.log('err' , e);
                res.writeHead(400 , headers);
                res.write(JSON.stringify({
                    "status": "false",
                    "message": "欄位錯誤"
                }))
                res.end();

            }
        })
    }
}


const server = http.createServer(requestListener);
server.listen(process.env.PORT);

// nodemon server.js
// http://127.0.0.1:3005/