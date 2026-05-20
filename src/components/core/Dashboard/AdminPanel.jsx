import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getAdminOverview, setAdminUserActive } from "../../../services/operations/courseDetailsAPI"

export default function AdminPanel() {
  const { token } = useSelector((state) => state.auth)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setData(await getAdminOverview(token))
      setLoading(false)
    }
    load()
  }, [token])

  const updateUser = async (userId, active) => {
    const updated = await setAdminUserActive({ userId, active }, token)
    if (updated) {
      setData((current) => ({
        ...current,
        users: current.users.map((user) => (user._id === updated._id ? updated : user)),
      }))
    }
  }

  if (loading) return <div className="spinner"></div>
  if (!data) return <p className="text-richblack-100">Admin data unavailable.</p>

  const summaryCards = [
    ["Users", data.summary.users],
    ["Students", data.summary.students],
    ["Instructors", data.summary.instructors],
    ["Courses", data.summary.courses],
    ["Published", data.summary.publishedCourses],
    ["Revenue", `Rs. ${data.summary.revenue}`],
  ]

  return (
    <div className="text-richblack-5">
      <h1 className="mb-8 text-3xl font-medium">Admin Panel</h1>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {summaryCards.map(([label, value]) => (
          <div key={label} className="rounded-md bg-richblack-800 p-5">
            <p className="text-sm text-richblack-300">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-md border border-richblack-700 bg-richblack-800 p-4">
          <h2 className="mb-4 text-xl font-semibold">Users</h2>
          <div className="max-h-[420px] space-y-3 overflow-auto pr-2">
            {data.users.map((user) => (
              <div key={user._id} className="flex items-center justify-between gap-3 rounded-md bg-richblack-700 p-3">
                <div>
                  <p className="font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-richblack-300">{user.email} - {user.accountType}</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateUser(user._id, !user.active)}
                  className={`rounded-md px-3 py-1 text-sm font-semibold ${user.active ? "bg-pink-200 text-richblack-900" : "bg-caribbeangreen-200 text-richblack-900"}`}
                >
                  {user.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-richblack-700 bg-richblack-800 p-4">
          <h2 className="mb-4 text-xl font-semibold">Courses and Categories</h2>
          <div className="max-h-[420px] space-y-3 overflow-auto pr-2">
            {data.courses.map((course) => (
              <div key={course._id} className="rounded-md bg-richblack-700 p-3">
                <div className="flex justify-between gap-3">
                  <p className="font-semibold">{course.courseName}</p>
                  <span className="text-sm text-yellow-50">{course.status}</span>
                </div>
                <p className="text-xs text-richblack-300">
                  {course.category?.name || "No category"} - {course.studentsEnrolled?.length || 0} students
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
