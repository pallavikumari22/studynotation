const Razorpay=require("razorpay");

const isRazorpayConfigured = Boolean(process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET);

exports.isRazorpayConfigured = isRazorpayConfigured;

exports.instance = isRazorpayConfigured
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    })
  : null;
