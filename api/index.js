const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

mongoose.connect(process.env.MONGOURI).then(()=>{
    console.log("Connetced to Mongo DB")
}).catch((err)=>{
    console.log(err)
})

const app = express()
app.use(express.json())

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})

// CORS options
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    exposedHeaders: 'Authorization',
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
  
  // Enable CORS with options
  app.use(cors(corsOptions));

// ROUTESS
const userRoutes = require('./routes/user.route')
const authRoutes = require('./routes/auth.route')
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({status: false, message, statusCode})
    });