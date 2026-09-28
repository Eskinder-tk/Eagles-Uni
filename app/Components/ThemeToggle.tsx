"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Skeleton loader matching exact dimensions to avoid layout shift
  if (!mounted) {
    return <div className="h-6 w-11 rounded-full bg-gray-200 dark:bg-gray-800" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
        focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        ${isDark ? "bg-gray-600" : "bg-gray-300"}
      `}
    >
      <span
        className={`
          pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full 
          bg-white shadow-md ring-0 transition duration-200 ease-in-out text-[10px]
          ${isDark ? "translate-x-5" : "translate-x-0"}
        `}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  )
}

export default ThemeToggle