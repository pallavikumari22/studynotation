const nodemailer=require('nodemailer');
require("dotenv").config();
const mailSender=async(email,title,body)=>{
  try{
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.warn("Mail service is not configured. Skipping email:", title);
      return { skipped: true, response: "Mail service is not configured" };
    }

    //Create Transporter
    let transporter=nodemailer.createTransport({
      host:process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASS,
      },
    });

    //Send mail
    let info=await transporter.sendMail({
      from:"StudyNotion",
      to:`${email}`,
      subject:`${title}`,
      html:`${body}`
    });

    console.log(info);
    return info;
  }
  catch(err){
    console.log(err.message);
  }
}


module.exports=mailSender;
