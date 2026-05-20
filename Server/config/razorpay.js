const Razorpay=require("razorpay");

exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY || "rzp_test",
  key_secret: process.env.RAZORPAY_SECRET || "test_secret",
});