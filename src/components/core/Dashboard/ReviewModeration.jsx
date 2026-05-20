import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getModerationReviews, moderateReview } from "../../../services/operations/courseDetailsAPI"

export default function ReviewModeration() {
  const { token } = useSelector((state) => state.auth)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setReviews(await getModerationReviews(token))
      setLoading(false)
    })()
  }, [token])

  const setStatus = async (reviewId, status) => {
    const updated = await moderateReview({ reviewId, status }, token)
    if (updated) {
      setReviews((current) => current.map((review) => (review._id === updated._id ? { ...review, ...updated } : review)))
    }
  }

  return (
    <div className="text-richblack-5">
      <h1 className="mb-8 text-3xl font-medium">Review Moderation</h1>
      {loading ? (
        <div className="spinner"></div>
      ) : reviews.length ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-md border border-richblack-700 bg-richblack-800 p-4">
              <div className="mb-3 flex flex-col justify-between gap-2 md:flex-row">
                <div>
                  <p className="font-semibold">{review.course?.courseName || "Unknown course"}</p>
                  <p className="text-sm text-richblack-300">
                    {review.user?.firstName} {review.user?.lastName} - {review.rating}/5
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-richblack-700 px-2 py-1 text-xs text-yellow-50">
                    {review.reportCount || 0} reports
                  </span>
                  <span className="rounded-md bg-richblack-700 px-2 py-1 text-xs">{review.status}</span>
                </div>
              </div>
              <p className="mb-3 text-richblack-100">{review.review}</p>
              {review.reportReasons?.length > 0 && (
                <p className="mb-3 text-xs text-richblack-300">Latest report: {review.reportReasons[review.reportReasons.length - 1]}</p>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStatus(review._id, "Visible")} className="rounded-md bg-caribbeangreen-200 px-3 py-2 text-sm font-semibold text-richblack-900">
                  Show
                </button>
                <button type="button" onClick={() => setStatus(review._id, "Hidden")} className="rounded-md bg-pink-200 px-3 py-2 text-sm font-semibold text-richblack-900">
                  Hide
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-md bg-richblack-800 p-6 text-richblack-100">No reviews yet.</p>
      )}
    </div>
  )
}
