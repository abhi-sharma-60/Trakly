import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db/index.js'
//import router from './routes/index.js'
import cookieParser from "cookie-parser"

dotenv.config({
    path:'./.env'
})



const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser());

//api
app.use('/api',router)

connectDB().then(()=>{
    console.log("Database connected!")
    server.listen(PORT,()=>{console.log(`server running at ${PORT}...`)})
})

