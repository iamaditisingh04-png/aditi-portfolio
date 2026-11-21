import { useState } from 'react'
import { useParallax } from '../../lib/useParallax'
import { FlowerMark } from '../ui/Ornaments'

export function PortraitFrame() {
  const [failed, setFailed] = useState(false)
  const frameRef = useParallax<HTMLDivElement>(26)

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="pointer-events-none absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(245,205,104,0.5),rgba(255,242,216,0)_68%)] blur-3xl" />

      <div ref={frameRef} className="relative transition-transform duration-300 will-change-transform">
        <div className="absolute -inset-5 rounded-[54%_46%_47%_53%/50%_55%_45%_50%] border border-leaf/30" />
        <div className="absolute -inset-9 rounded-[45%_55%_53%_47%/55%_45%_53%_47%] border border-turquoise/20" />

        <div className="relative overflow-hidden rounded-[48%_52%_44%_56%/52%_46%_54%_48%] border-[11px] border-cream bg-[#f3e2c4] shadow-[0_36px_90px_-40px_rgba(4,34,20,0.62)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[48%_52%_44%_56%/52%_46%_54%_48%]">
            {failed ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_32%_22%,#fff8e7,#f0d9b4_58%,#e2c79c)]">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-forest/20 bg-cream/70">
                  <span className="font-display text-3xl font-light tracking-[0.1em] text-forest/70">
                    AS
                  </span>
                </div>
                <div className="flex items-center gap-2 text-leaf/70">
                  <span className="h-px w-8 bg-current" />
                  <FlowerMark className="h-3.5 w-3.5 text-sun" />
                  <span className="h-px w-8 bg-current" />
                </div>
              </div>
            ) : (
              <img
                src="/aditi.jpg"
                alt="Portrait of Aditi Singh"
                onError={() => setFailed(true)}
                className="h-full w-full object-cover object-[center_26%]"
                draggable={false}
              />
            )}

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_16%,rgba(255,244,206,0.34),transparent_52%)]" />
            <div className="pointer-events-none absolute inset-0 rounded-[48%_52%_44%_56%/52%_46%_54%_48%] shadow-[inset_0_0_70px_rgba(92,68,36,0.26)]" />
          </div>
        </div>

        <BotanicalCorner className="-left-7 -top-7" />
        <BotanicalCorner className="-bottom-9 -right-6 rotate-180" />

        <div className="absolute -right-4 top-[22%] flex h-11 w-11 items-center justify-center rounded-full border border-sun/40 bg-cream/90 shadow-[0_12px_28px_-16px_rgba(30,60,40,0.7)] backdrop-blur-sm">
          <FlowerMark className="h-5 w-5 text-terracotta" />
        </div>

        <div className="absolute -bottom-7 -left-3 rotate-[-3deg] border border-forest/10 bg-[#fff8e8] px-5 py-3 shadow-[0_20px_40px_-28px_rgba(24,54,36,0.7)]">
          <p className="font-display text-[0.95rem] leading-none text-forest-deep">Aditi Singh</p>
          <p className="mt-1.5 font-sans text-[0.48rem] uppercase tracking-[0.3em] text-forest/45">
            NIE, Mysore
          </p>
        </div>
      </div>
    </div>
  )
}

function BotanicalCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={`pointer-events-none absolute h-24 w-24 text-leaf/60 ${className ?? ''}`}
    >
      <path
        d="M8 96C26 78 40 58 48 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {[
        'M30 82c-10-1-16-7-17-16 11 0 17 6 17 16Z',
        'M40 64c10 1 17-4 19-13-11-1-17 4-19 13Z',
        'M47 46c-9-2-13-8-13-16 9 1 14 7 13 16Z',
      ].map((d) => (
        <path key={d} d={d} fill="currentColor" opacity="0.55" />
      ))}
      <g transform="translate(52 20)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-6"
            rx="3.2"
            ry="5.6"
            fill="#E9A5AE"
            opacity="0.85"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle r="2.6" fill="#F5CD68" />
      </g>
    </svg>
  )
}
