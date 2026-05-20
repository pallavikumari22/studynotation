import { useEffect, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { apiConnector } from "../services/apiconnector"
import { aiEndpoints } from "../services/apis"

const starterPrompts = [
  "Create a 4 week web development roadmap",
  "Suggest courses for becoming job ready",
  "Generate 5 quiz questions for JavaScript basics",
  "Help me choose between frontend and backend",
]

export default function AIAssistant() {
  const [profile, setProfile] = useState({
    goal: "Full stack web development",
    level: "Beginner",
    timePerWeek: "6",
    budget: "",
  })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [source, setSource] = useState("local")
  const [chat, setChat] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("aiTutorChat") || "[]")
    } catch (error) {
      return []
    }
  })

  const hasChat = chat.length > 0

  const serializedChat = useMemo(() => JSON.stringify(chat), [chat])

  useEffect(() => {
    localStorage.setItem("aiTutorChat", serializedChat)
  }, [serializedChat])

  const updateProfile = (name, value) => {
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const askAdvisor = async (prompt = message) => {
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt && !profile.goal.trim()) {
      toast.error("Add a goal or question first")
      return
    }

    const userMessage = {
      role: "user",
      content: trimmedPrompt || `Build a plan for ${profile.goal}`,
    }

    setLoading(true)
    setChat((current) => [...current, userMessage])

    try {
      const response = await apiConnector("POST", aiEndpoints.AI_ADVISOR_API, {
        ...profile,
        message: userMessage.content,
        history: chat,
      })

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "AI request failed")
      }

      const answer = response.data.data.answer
      setRecommendations(response.data.data.courses || [])
      setSource(response.data.source || "local")
      setChat((current) => [...current, { role: "assistant", content: answer }])
      setMessage("")
    } catch (error) {
      console.log("AI tutor error", error)
      toast.error(error?.response?.data?.message || "Could not reach the AI tutor")
      setChat((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I could not reach the AI service right now. Try again after checking the backend environment variables.",
        },
      ])
    }

    setLoading(false)
  }

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const response = await apiConnector(
        "GET",
        aiEndpoints.AI_RECOMMENDATIONS_API,
        null,
        null,
        profile
      )

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Could not fetch recommendations")
      }

      setRecommendations(response.data.data.courses || [])
      setChat((current) => [
        ...current,
        { role: "assistant", content: response.data.data.summary },
      ])
    } catch (error) {
      console.log("AI recommendation error", error)
      toast.error("Could not load recommendations")
    }
    setLoading(false)
  }

  const clearChat = () => {
    setChat([])
    setRecommendations([])
    localStorage.removeItem("aiTutorChat")
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900 py-10 text-richblack-5">
      <div className="mx-auto grid w-11/12 max-w-maxContent gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="h-fit rounded-md border border-richblack-700 bg-richblack-800 p-5">
          <p className="text-sm font-semibold uppercase text-yellow-50">AI Tutor</p>
          <h1 className="mt-2 text-3xl font-bold">Plan smarter. Learn faster.</h1>
          <p className="mt-3 text-sm leading-6 text-richblack-200">
            Get course picks, roadmaps, quiz ideas, projects, and study support from your catalog.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <label className="text-sm text-richblack-100">
              Goal
              <input
                value={profile.goal}
                onChange={(event) => updateProfile("goal", event.target.value)}
                className="form-style mt-2"
                placeholder="I want to learn..."
              />
            </label>

            <label className="text-sm text-richblack-100">
              Level
              <select
                value={profile.level}
                onChange={(event) => updateProfile("level", event.target.value)}
                className="form-style mt-2"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm text-richblack-100">
                Hours/week
                <input
                  type="number"
                  min="1"
                  value={profile.timePerWeek}
                  onChange={(event) => updateProfile("timePerWeek", event.target.value)}
                  className="form-style mt-2"
                />
              </label>
              <label className="text-sm text-richblack-100">
                Budget
                <input
                  type="number"
                  min="0"
                  value={profile.budget}
                  onChange={(event) => updateProfile("budget", event.target.value)}
                  className="form-style mt-2"
                  placeholder="Any"
                />
              </label>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={loadRecommendations}
              className="rounded-md bg-yellow-50 px-4 py-3 font-semibold text-richblack-900 disabled:opacity-60"
            >
              Recommend courses
            </button>
          </div>

          <div className="mt-6 grid gap-2">
            {starterPrompts.map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => askAdvisor(prompt)}
                className="rounded-md border border-richblack-700 bg-richblack-900 px-3 py-2 text-left text-sm text-richblack-100 hover:border-yellow-50 hover:text-yellow-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex min-h-[680px] flex-col rounded-md border border-richblack-700 bg-richblack-800">
          <div className="flex flex-col gap-3 border-b border-richblack-700 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Learning assistant</h2>
              <p className="text-sm text-richblack-300">
                Mode: {source === "openai" ? "OpenAI powered" : "Local fallback"}
              </p>
            </div>
            {hasChat && (
              <button
                type="button"
                onClick={clearChat}
                className="rounded-md border border-richblack-600 px-3 py-2 text-sm text-richblack-100"
              >
                Clear chat
              </button>
            )}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {!hasChat && (
              <div className="grid min-h-[300px] place-items-center rounded-md border border-dashed border-richblack-600 p-8 text-center">
                <div>
                  <p className="text-2xl font-semibold text-richblack-25">Ask for a plan, quiz, or course match.</p>
                  <p className="mt-3 max-w-xl text-richblack-300">
                    The assistant uses your goal and the published course catalog to keep answers practical.
                  </p>
                </div>
              </div>
            )}

            {chat.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`rounded-md border p-4 ${
                  item.role === "user"
                    ? "ml-auto max-w-2xl border-yellow-100 bg-yellow-900 text-richblack-5"
                    : "mr-auto max-w-3xl border-richblack-700 bg-richblack-900 text-richblack-100"
                }`}
              >
                <p className="mb-2 text-xs font-semibold uppercase text-richblack-300">
                  {item.role === "user" ? "You" : "StudyNotion AI"}
                </p>
                <div className="prose prose-invert max-w-none prose-p:my-2 prose-li:my-1">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="mr-auto max-w-xl rounded-md border border-richblack-700 bg-richblack-900 p-4 text-richblack-200">
                Thinking through your next best step...
              </div>
            )}

            {recommendations.length > 0 && (
              <section className="pt-2">
                <h3 className="mb-3 text-lg font-semibold">Recommended courses</h3>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {recommendations.map((course) => (
                    <Link
                      key={course._id}
                      to={String(course._id).startsWith("demo-") ? "/courses" : `/courses/${course._id}`}
                      className="rounded-md border border-richblack-700 bg-richblack-900 p-3 hover:border-yellow-50"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-32 w-full rounded object-cover"
                      />
                      <p className="mt-3 font-semibold text-richblack-5">{course.courseName}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-richblack-300">
                        {course.courseDescription}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-yellow-50">Rs {course.price || 0}</span>
                        <span className="text-richblack-300">
                          {course.studentsEnrolled?.length || 0} students
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              askAdvisor()
            }}
            className="flex flex-col gap-3 border-t border-richblack-700 p-5 md:flex-row"
          >
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={2}
              className="form-style min-h-[52px] flex-1 resize-none"
              placeholder="Ask for a roadmap, quiz, project ideas, or course guidance..."
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 disabled:opacity-60"
            >
              Ask
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}
