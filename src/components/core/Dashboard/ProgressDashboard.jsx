import { useEffect, useMemo, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function ProgressDashboard() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setCourses(await getUserEnrolledCourses(token))
      setLoading(false)
    })()
  }, [token])

  const stats = useMemo(() => {
    const completed = courses.filter((course) => (course.progressPercentage || 0) >= 100).length
    const average = courses.length
      ? Math.round(courses.reduce((sum, course) => sum + (course.progressPercentage || 0), 0) / courses.length)
      : 0
    return { completed, average }
  }, [courses])

  return (
    <div className="text-richblack-5">
      <h1 className="mb-8 text-3xl font-medium">Course Progress</h1>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-md bg-richblack-800 p-5"><p className="text-richblack-300">Enrolled</p><p className="text-3xl font-bold">{courses.length}</p></div>
        <div className="rounded-md bg-richblack-800 p-5"><p className="text-richblack-300">Completed</p><p className="text-3xl font-bold">{stats.completed}</p></div>
        <div className="rounded-md bg-richblack-800 p-5"><p className="text-richblack-300">Average progress</p><p className="text-3xl font-bold">{stats.average}%</p></div>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : courses.length ? (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course._id} className="rounded-md border border-richblack-700 bg-richblack-800 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-sm text-richblack-300">{course.totalDuration || "Duration unavailable"}</p>
                </div>
                <p className="font-semibold text-yellow-50">{course.progressPercentage || 0}%</p>
              </div>
              <ProgressBar completed={course.progressPercentage || 0} height="10px" isLabelVisible={false} />
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-md bg-richblack-800 p-6 text-richblack-100">Enroll in a course to see progress here.</p>
      )}
    </div>
  )
}
