//Create instance of express/server
const express=require("express");
const app=express();
const mongoose = require("mongoose");



//Routes import
const userRoutes=require("./routes/User");
const profileRoutes=require("./routes/Profile");
const paymentRoutes=require("./routes/Payments");
const courseRoutes=require("./routes/Course");
const contactRoutes=require("./routes/Contact");
const aiRoutes=require("./routes/AI");

//Connection
const database=require("./config/database");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");
//load all the config into dotenv instance
dotenv.config();

//PORT NO
const PORT=process.env.PORT || 4000;

//databaseconnect
database.connect();
cloudinaryConnect();

//Middleware

//To parse json
app.use(express.json());

//To parse cookie
app.use(cookieParser());

//To allow backend to entertain req from frontend
app.use(
  cors({
    //frontend url
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials:true,
  })
);

app.use(
  fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp",
  })
);


//Mounting routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/reach",contactRoutes);
app.use("/api/v1/ai",aiRoutes);


//default route
app.get("/",(req,res)=>{
  return res.json({
    success:true,
    message:"Your server is up and running",
  })
})

app.get("/api/health",(req,res)=>{
  return res.json({
    success:true,
    message:"StudyNotion API is healthy",
    uptime:process.uptime(),
  })
})

// Global error handler to prevent unhandled 500 crashes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

if (require.main === module) {
  const server = app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
  })
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} already in use. Use PORT=4001 node index.js or kill existing process.`);
      process.exit(1);
    } else {
      console.error(err);
    }
  });
}

module.exports = app;
