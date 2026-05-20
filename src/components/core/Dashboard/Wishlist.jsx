import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import CourseCard from "../Catalog/CourseCard"
import { getWishlist, toggleWishlist } from "../../../services/operations/profileAPI"

export default function Wishlist() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true)
      setCourses(await getWishlist(token))
      setLoading(false)
    }
    loadWishlist()
  }, [token])

  const removeCourse = async (courseId) => {
    const updated = await toggleWishlist(courseId, token)
    if (updated) setCourses(updated)
  }

  return (
    <div className="text-richblack-5">
      <h1 className="mb-8 text-3xl font-medium">Saved Courses</h1>
      {loading ? (
        <div className="spinner"></div>
      ) : courses.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <div key={course._id} className="rounded-md border border-richblack-700 bg-richblack-800 p-3">
              <CourseCard course={course} Height="h-[190px]" />
              <button
                type="button"
                onClick={() => removeCourse(course._id)}
                className="mt-2 w-full rounded-md bg-richblack-700 px-3 py-2 text-sm font-semibold text-richblack-25"
              >
                Remove from saved
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-md border border-richblack-700 bg-richblack-800 p-6 text-richblack-100">
          You have not saved any courses yet.
        </p>
      )}
    </div>
  )
}
