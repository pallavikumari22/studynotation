//require statements
require("dotenv").config();
const mongoose=require('mongoose');


exports.connect=()=>{
  if (mongoose.connection.readyState >= 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (!process.env.MONGODB_URL) {
    console.warn("MONGODB_URL is not configured");
    return Promise.resolve(null);
  }

  return mongoose.connect(process.env.MONGODB_URL).then(()=>{console.log("DB CONNECTION SUCCESSFUL")})
  .catch((err)=>{
    console.log("DB CONNECTION ISSUES");
    console.error(err);
  })
}
