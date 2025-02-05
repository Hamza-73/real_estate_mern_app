const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
dotenv.config()

mongoose.connect(process.env.MONGOURI).then(()=>{
    console.log("Connetced to Mongo DB")
}).catch((err)=>{
    console.log(err)
})
// mongoose.connect('mongodb://127.0.0.1:27017/mern-estate').then(()=>{
//     console.log("Connetced to Mongo DB")
// }).catch((err)=>{
//     console.log(err)
// })

const app = express()
app.use(express.json())
app.use(cookieParser())

// const __dirname = path.resolve();

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})

// CORS options
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:5173', 'https://real-estate-mern-app-gamma.vercel.app'];
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
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
const listingRoutes = require('./routes/listing.route')
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/listing', listingRoutes)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  })
  

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({status: false, message, statusCode})
    });