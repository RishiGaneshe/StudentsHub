require('dotenv').config();
const express= require('express')
const path= require('path')
const cors = require('cors');
const userRoute= require('./routes/user.js')
const AdminRoute= require('./routes/admin.js')
const cookieParser = require('cookie-parser');
const middleware= require('./middlewares/Authmiddleware.js')
const {connectToMongoDB}= require('./services/connection.js')
const {requestLimiter}= require('./middlewares/loginRateLimiter.js')


const app= express();

const PORT= process.env.PORT || 5000;
const DATABASE_URL= process.env.DATABASE_URL


connectToMongoDB(DATABASE_URL)
            .then(()=>{console.log("MongoDB Connected")})
            .catch((err)=>{console.log("Problem in connecting database",err)})


app.set("view engine","ejs");                              // using view engine to rander web-pages on server
app.set("views",path.join(__dirname,'views'))

const staticPath=path.join(__dirname,"./pages");           //  for creating static pages
app.use(express.static(staticPath));

app.use(cors());                                           //  To allow cross origin requests 
app.use(cookieParser());                                   //  To parse cookies from req
app.use(express.json());                                   //  Middleware to parse JSON data
app.use(express.urlencoded({ extended: false }));          //  Middleware to parse URL-encoded data
app.use(requestLimiter)                                    //  Limiting number of request to 1200 for per 5 minutes


app.use("/",userRoute)
app.use("/admin",middleware.handleUserVarification,AdminRoute)



app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`)})

