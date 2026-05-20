import { useEffect, useState } from "react"
import { FiMoon, FiSun } from "react-icons/fi"

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark")

  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", theme === "light")
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      className="grid h-9 w-9 place-items-center rounded-md border border-richblack-700 bg-richblack-800 text-richblack-100"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? <FiSun /> : <FiMoon />}
    </button>
  )
}
