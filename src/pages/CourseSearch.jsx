import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import CourseCard from "../components/core/Catalog/CourseCard"
import { fetchCourseCategories, getAllCourses } from "../services/operations/courseDetailsAPI"
import { toggleWishlist } from "../services/operations/profileAPI"

export default function CourseSearch() {
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [compareCourses, setCompareCourses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("compareCourses") || "[]")
    } catch (error) {
      return []
    }
  })
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  const activeParams = useMemo(
    () => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== "")),
    [filters]
  )

  useEffect(() => {
    ;(async () => {
      setCategories(await fetchCourseCategories())
    })()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true)
      setCourses(await getAllCourses(activeParams))
      setLoading(false)
    }, 250)

    return () => clearTimeout(timeout)
  }, [activeParams])

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const toggleCompare = (course) => {
    setCompareCourses((current) => {
      const exists = current.some((item) => item._id === course._id)
      const updated = exists
        ? current.filter((item) => item._id !== course._id)
        : [...current.slice(-2), course]
      localStorage.setItem("compareCourses", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="mx-auto min-h-[calc(100vh-3.5rem)] w-11/12 max-w-maxContent py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-yellow-50">Discover</p>
          <h1 className="text-3xl font-bold text-richblack-5">Search and filter courses</h1>
        </div>
        <Link
          to="/compare"
          className={`rounded-md px-4 py-2 font-semibold ${
            compareCourses.length >= 2 ? "bg-yellow-50 text-richblack-900" : "bg-richblack-700 text-richblack-300"
          }`}
        >
          Compare {compareCourses.length}/3
        </Link>
      </div>

      <div className="grid gap-3 rounded-md border border-richblack-700 bg-richblack-800 p-4 md:grid-cols-6">
        <input
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
          placeholder="Search by title, topic, or tag"
          className="form-style md:col-span-2"
        />
        <select value={filters.category} onChange={(event) => updateFilter("category", event.target.value)} className="form-style">
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(event) => updateFilter("maxPrice", event.target.value)}
          placeholder="Max price"
          className="form-style"
        />
        <select value={filters.minRating} onChange={(event) => updateFilter("minRating", event.target.value)} className="form-style">
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
        </select>
        <select value={`${filters.sortBy}:${filters.sortOrder}`} onChange={(event) => {
          const [sortBy, sortOrder] = event.target.value.split(":")
          setFilters((current) => ({ ...current, sortBy, sortOrder }))
        }} className="form-style">
          <option value="createdAt:desc">Newest</option>
          <option value="price:asc">Price low to high</option>
          <option value="price:desc">Price high to low</option>
        </select>
      </div>

      {loading ? (
        <div className="grid min-h-[260px] place-items-center"><div className="spinner"></div></div>
      ) : courses.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course._id} className="relative rounded-md border border-richblack-700 bg-richblack-800 p-3">
              {token && (
                <button
                  type="button"
                  onClick={() => toggleWishlist(course._id, token)}
                  className="absolute right-4 top-4 z-10 rounded-md bg-yellow-50 px-3 py-1 text-sm font-semibold text-richblack-900"
                >
                  Save
                </button>
              )}
              <CourseCard course={course} Height="h-[220px]" />
              <button
                type="button"
                onClick={() => toggleCompare(course)}
                className={`mt-2 w-full rounded-md px-3 py-2 text-sm font-semibold ${
                  compareCourses.some((item) => item._id === course._id)
                    ? "bg-yellow-50 text-richblack-900"
                    : "bg-richblack-700 text-richblack-25"
                }`}
              >
                {compareCourses.some((item) => item._id === course._id) ? "Selected for comparison" : "Compare"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-md border border-richblack-700 bg-richblack-800 p-8 text-center text-richblack-100">
          No courses match those filters.
        </p>
      )}
    </div>
  )
}
