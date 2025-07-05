import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors"
import dotenv from 'dotenv';
import connectDB from './config/database.js'

const app=express();
app.use(bodyParser.json())
dotenv.config();
app.use(cors({
    origin: '*',
    credentials: true   
}));
app.use(bodyParser.urlencoded({ extended: true }));
connectDB()
.then(()=>{
    app.listen(5000,()=>{
        console.log(`server is listening on port ${5000}`);
    })
})
.catch((error)=>{
    console.log(`mongoDb connection error`,error);
})