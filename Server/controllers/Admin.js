const Category = require("../models/Category")
const Course = require("../models/Course")
const RatingAndReview = require("../models/RatingAndReview")
const User = require("../models/User")

exports.getAdminOverview = async (req, res) => {
  try {
    const [users, courses, categories, reviews] = await Promise.all([
      User.find({}).select("firstName lastName email accountType active courses createdAt").lean(),
      Course.find({})
        .populate("instructor", "firstName lastName email")
        .populate("category", "name")
        .populate("ratingAndReviews")
        .lean(),
      Category.find({}).populate("courses", "courseName status").lean(),
      RatingAndReview.find({}).populate("user", "firstName lastName email").populate("course", "courseName").lean(),
    ])

    const publishedCourses = courses.filter((course) => course.status === "Published")
    const revenue = courses.reduce(
      (sum, course) => sum + ((course.studentsEnrolled?.length || 0) * (course.price || 0)),
      0
    )

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          users: users.length,
          students: users.filter((user) => user.accountType === "Student").length,
          instructors: users.filter((user) => user.accountType === "Instructor").length,
          admins: users.filter((user) => user.accountType === "Admin").length,
          courses: courses.length,
          publishedCourses: publishedCourses.length,
          draftCourses: courses.length - publishedCourses.length,
          categories: categories.length,
          reviews: reviews.length,
          reportedReviews: reviews.filter((review) => (review.reportCount || 0) > 0).length,
          revenue,
        },
        users,
        courses,
        categories,
        reviews,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.setUserActive = async (req, res) => {
  try {
    const { userId, active } = req.body
    const user = await User.findByIdAndUpdate(userId, { active }, { new: true }).select(
      "firstName lastName email accountType active"
    )

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
