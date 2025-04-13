import { useEffect, useState } from "react"

export default function Loader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 10
        return next > 100 ? 100 : next
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 h-32 w-32 animate-[spin_3s_linear_infinite] rounded-full border-4 border-dashed border-[#4bb3ba] opacity-30" />
          
          <div className="absolute inset-0 h-32 w-32 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border-4 border-[#18446a] opacity-20" />

          <div className="relative flex h-32 w-32 animate-[spin_2s_ease-in-out_infinite_alternate] items-center justify-center rounded-full bg-gradient-to-br from-[#4bb3ba] to-[#18446a] shadow-lg">
            <div className="h-16 w-16 animate-[bounce_1s_infinite] rounded-full bg-white shadow-inner" />
          </div>
        </div>

        <div className="h-2 w-64 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4bb3ba] to-[#18446a] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="font-mono text-sm text-[#4bb3ba]">
          <span className="inline-block animate-[bounce_1s_ease-in-out_0.1s_infinite]">L</span>
          <span className="inline-block animate-[bounce_1s_ease-in-out_0.2s_infinite]">o</span>
          <span className="inline-block animate-[bounce_1s_ease-in-out_0.3s_infinite]">a</span>
          <span className="inline-block animate-[bounce_1s_ease-in-out_0.4s_infinite]">d</span>
          <span className="inline-block animate-[bounce_1s_ease-in-out_0.5s_infinite]">i</span>
          <span className="inline-block animate-[bounce_1s_ease-in-out_0.6s_infinite]">n</span>
          <span className="inline-block animate-[bounce_1s_ease-in-out_0.7s_infinite]">g</span>
          <span className="inline-block animate-[bounce_1s_ease-in-out_0.8s_infinite]">.</span>
          <span className="inline-block animate-[bounce_1s_ease-in-out_0.9s_infinite]">.</span>
          <span className="inline-block animate-[bounce_1s_ease-in-out_1s_infinite]">.</span>
        </div>
      </div>
    </div>
  )
}
