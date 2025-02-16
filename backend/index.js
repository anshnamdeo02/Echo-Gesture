const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require('./connection');

const app = express();
const authRouter = require("./Routes/auth");
const userRouter = require('./Routes/user');

dotenv.config();

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


const PORT = process.env.PORT || 8002;
app.listen(PORT,()=> console.log(`Server Running at ${PORT}`));


connectMongoDB(process.env.MONGODB_URL)
  .then(()=> console.log("MongoDb connected Successfully"))
  .catch((error)=> console.error("Error Connecting MongoDb",error));


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/api/auth/",authRouter);
app.use("/api/user/",userRouter);

app.get('/',(req,res)=>{
    return res.send("Server is  Running");
})