import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import RatingStars from "../components/common/RatingStars"
import GetAvgRating from "../utils/avgRating"

export default function CompareCourses() {
  const [courses, setCourses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("compareCourses") || "[]")
    } catch (error) {
      return []
    }
  })

  const rows = useMemo(
    () => [
      ["Price", (course) => `Rs. ${course.price || 0}`],
      ["Rating", (course) => {
        const rating = GetAvgRating(course.ratingAndReviews)
        return (
          <div className="flex items-center gap-2">
            <span>{rating || 0}</span>
            <RatingStars Review_Count={rating} />
          </div>
        )
      }],
      ["Students", (course) => course.studentsEnrolled?.length || 0],
      ["Instructor", (course) => `${course.instructor?.firstName || ""} ${course.instructor?.lastName || ""}`.trim() || "Unknown"],
      ["Category", (course) => course.category?.name || "Uncategorized"],
      ["Description", (course) => course.courseDescription || "No description"],
    ],
    []
  )

  const removeCourse = (courseId) => {
    const updated = courses.filter((course) => course._id !== courseId)
    setCourses(updated)
    localStorage.setItem("compareCourses", JSON.stringify(updated))
  }

  const clearAll = () => {
    setCourses([])
    localStorage.removeItem("compareCourses")
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-3.5rem)] w-11/12 max-w-maxContent py-10 text-richblack-5">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-yellow-50">Compare</p>
          <h1 className="text-3xl font-bold">Compare Courses</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/courses" className="rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900">
            Add courses
          </Link>
          {courses.length > 0 && (
            <button type="button" onClick={clearAll} className="rounded-md bg-richblack-700 px-4 py-2 font-semibold text-richblack-25">
              Clear
            </button>
          )}
        </div>
      </div>

      {courses.length < 2 ? (
        <div className="rounded-md border border-richblack-700 bg-richblack-800 p-8 text-center text-richblack-100">
          Select at least two courses from search to compare them side by side.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-richblack-700 bg-richblack-800">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-richblack-700">
                <th className="w-[180px] p-4 text-richblack-300">Feature</th>
                {courses.map((course) => (
                  <th key={course._id} className="min-w-[240px] p-4 align-top">
                    <img src={course.thumbnail} alt={course.courseName} className="mb-3 h-32 w-full rounded-md object-cover" />
                    <div className="flex items-start justify-between gap-3">
                      <Link to={`/courses/${course._id}`} className="font-semibold text-yellow-50">
                        {course.courseName}
                      </Link>
                      <button type="button" onClick={() => removeCourse(course._id)} className="text-xs text-richblack-300">
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, render]) => (
                <tr key={label} className="border-b border-richblack-700 last:border-b-0">
                  <td className="p-4 font-semibold text-richblack-100">{label}</td>
                  {courses.map((course) => (
                    <td key={course._id} className="p-4 align-top text-richblack-100">
                      {render(course)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
