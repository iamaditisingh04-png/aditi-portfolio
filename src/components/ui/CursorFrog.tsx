
import { useEffect, useState } from 'react'

const frogReplies = [
  'dont touch me',
  'im just chilling',
  'just chill chill~',
]

export function CursorFrog() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [message, setMessage] = useState('')
  const [messageKey, setMessageKey] = useState(0)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPointer({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (!message) return

    const timeout = window.setTimeout(() => {
      setMessage('')
    }, 2000)

    return () => window.clearTimeout(timeout)
  }, [message, messageKey])

  const frogX =
    typeof window !== 'undefined' ? window.innerWidth - 65 : 0

  const frogY =
    typeof window !== 'undefined' ? window.innerHeight - 65 : 0

  const dx = pointer.x - frogX
  const dy = pointer.y - frogY

  const eyeX = Math.max(-3, Math.min(3, dx / 45))
  const eyeY = Math.max(-3, Math.min(3, dy / 45))

  const handleFrogClick = () => {
    const randomReply =
      frogReplies[Math.floor(Math.random() * frogReplies.length)]

    setMessage(randomReply)
    setMessageKey((previous) => previous + 1)
  }

  return (
    <>
      <div className="frog-companion fixed bottom-4 right-4 z-[9998] hidden md:block">

        {/* Speech bubble */}
        {message && (
          <div
            key={messageKey}
            className="absolute bottom-[105px] right-0 whitespace-nowrap rounded-2xl border border-[#829b75]/40 bg-[#f3ead7] px-4 py-2 text-sm font-semibold text-[#26382d] shadow-lg animate-fade-up"
          >
            {message}
            <span className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-b border-r border-[#829b75]/40 bg-[#f3ead7]" />
          </div>
        )}

        {/* Clickable frog */}
        <button
          type="button"
          onClick={handleFrogClick}
          aria-label="Click the frog"
          className="frog-body relative h-[88px] w-[100px] cursor-pointer border-0 bg-transparent p-0 outline-none"
        >
          {/* Frog body */}
          <div className="absolute bottom-0 left-2 h-[66px] w-[88px] rounded-[48%_48%_42%_42%] border-2 border-[#32764a] bg-gradient-to-b from-[#9be58a] to-[#55b96c] shadow-[0_7px_16px_rgba(0,0,0,.2)]">
            {/* Cheeks */}
            <span className="absolute left-3 top-9 h-3 w-4 rounded-full bg-pink-300/60 blur-[2px]" />
            <span className="absolute right-3 top-9 h-3 w-4 rounded-full bg-pink-300/60 blur-[2px]" />

            {/* Smile */}
            <div className="absolute bottom-[17px] left-1/2 h-3 w-8 -translate-x-1/2 rounded-b-full border-b-2 border-[#28633e]" />

            {/* Freckles */}
            <span className="absolute left-[36px] top-[29px] h-1 w-1 rounded-full bg-[#347344]" />
            <span className="absolute right-[36px] top-[29px] h-1 w-1 rounded-full bg-[#347344]" />

            {/* Feet */}
            <span className="absolute -bottom-1 left-1 h-4 w-7 rounded-full bg-[#70cf7e]" />
            <span className="absolute -bottom-1 right-1 h-4 w-7 rounded-full bg-[#70cf7e]" />
          </div>

          {/* Left eye */}
          <div className="absolute left-[13px] top-0 z-10 h-[35px] w-[35px] rounded-full border-2 border-[#32764a] bg-[#8cda7c]">
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white">
              <span
                className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-[#24352b]"
                style={{
                  transform: `translate(calc(-50% + ${eyeX}px), calc(-50% + ${eyeY}px))`,
                }}
              />
            </div>
          </div>

          {/* Right eye */}
          <div className="absolute right-[13px] top-0 z-10 h-[35px] w-[35px] rounded-full border-2 border-[#32764a] bg-[#8cda7c]">
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white">
              <span
                className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full bg-[#24352b]"
                style={{
                  transform: `translate(calc(-50% + ${eyeX}px), calc(-50% + ${eyeY}px))`,
                }}
              />
            </div>
          </div>

          {/* Flower decoration */}
          <span className="absolute -right-1 top-2 text-lg text-[#e7b5d8]">
            ✿
          </span>
        </button>
      </div>

      <style>{`
        .frog-body {
          animation: frog-bob 3s ease-in-out infinite;
        }

        @keyframes frog-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @media (hover: none), (pointer: coarse) {
          .frog-companion { display: none !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .frog-body { animation: none; }
        }
      `}</style>
    </>
  )
}
