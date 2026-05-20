const express = require("express")
const router = express.Router()
const {isInstructor} =require("../middlewares/auth");
const { auth } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
  getWishlist,
  toggleWishlist,
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile",auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.get("/wishlist", auth, getWishlist)
router.post("/wishlist/toggle", auth, toggleWishlist)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)


router.get("/instructorDashboard",auth,isInstructor,instructorDashboard);


module.exports = router
