
import { useCallback, useEffect, useState } from 'react'

type Pad = {
  cracked: boolean
  firefly: boolean
}

const makePads = (): Pad[] =>
  Array.from({ length: 3 }, () => ({
    cracked: Math.random() < 0.3,
    firefly: Math.random() < 0.35,
  }))

export function FrogHop() {
  const [pads, setPads] = useState<Pad[]>(makePads)
  const [lane, setLane] = useState(1)
  const [score, setScore] = useState(0)
  const [hops, setHops] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('Choose a lily pad and hop!')

  const move = useCallback(
    (direction: number) => {
      if (gameOver) return
      setLane((current) => Math.max(0, Math.min(2, current + direction)))
    },
    [gameOver],
  )

  const hop = useCallback(() => {
    if (gameOver) return

    const chosenPad = pads[lane]

    if (chosenPad.cracked) {
      setGameOver(true)
      setMessage('SPLASH! That lily pad was cracked.')
      return
    }

    setScore((current) => current + 10 + (chosenPad.firefly ? 25 : 0))
    setHops((current) => current + 1)
    setMessage(chosenPad.firefly ? 'YUMMY! Firefly collected!' : 'Nice hop! Keep going!')
    setPads(makePads())
    setLane(1)
  }, [gameOver, lane, pads])

  const restart = () => {
    setPads(makePads())
    setLane(1)
    setScore(0)
    setHops(0)
    setGameOver(false)
    setMessage('Choose a lily pad and hop!')
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' ', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
      }

      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        move(-1)
      } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
        move(1)
      } else if (event.key === ' ' || event.key === 'ArrowUp') {
        hop()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move, hop])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#14251d] px-4 py-10 text-[#f3ead7]">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#476c4b] blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#806b8a] blur-[110px]" />
      </div>

      <section className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-[#829b75]/30 bg-[#26382d]/90 p-6 shadow-2xl backdrop-blur-md sm:p-10">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#c2d0b8]">
              OOPSIE! Wrong URL...
            </p>
            <p className="mt-1 text-sm font-semibold text-[#e9b58f]">
              But nvm, play this! 🐸
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Frog <span className="text-[#a9d68e]">Hop.</span> 🐸
            </h1>
          </div>

          <div className="rounded-2xl border border-[#829b75]/30 bg-[#17251e] px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-widest text-[#c2d0b8]">Score</p>
            <p className="text-2xl font-bold tabular-nums">{score}</p>
          </div>
        </div>

        <div className="relative mb-6 overflow-hidden rounded-3xl border border-[#829b75]/20 bg-[#17251e] px-4 py-8">
          <div className="mb-8 text-center">
            <span className="text-6xl" role="img" aria-label="frog">
              {gameOver ? '🐸💦' : '🐸'}
            </span>
            <p className="mt-3 text-sm text-[#c2d0b8]">{message}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {pads.map((pad, index) => (
              <button
                key={index}
                type="button"
                disabled={gameOver}
                onClick={() => setLane(index)}
                className={`relative flex min-h-28 flex-col items-center justify-center rounded-[50%] border-2 transition duration-200 sm:min-h-36 ${
                  lane === index
                    ? 'scale-105 border-[#e9b58f] bg-[#527c55] shadow-[0_0_25px_rgba(169,214,142,0.25)]'
                    : 'border-[#527c55]/60 bg-[#304d39] hover:bg-[#416448]'
                } ${gameOver && pad.cracked ? 'opacity-50' : ''}`}
              >
                <span className="text-3xl sm:text-4xl">
                  {pad.cracked ? '💔' : '🌿'}
                </span>

                {pad.firefly && !pad.cracked && (
                  <span className="absolute -right-1 -top-1 animate-pulse text-xl">
                    ✨
                  </span>
                )}

                {lane === index && !gameOver && (
                  <span className="mt-2 text-xs font-bold text-[#f3ead7]">
                    SELECTED
                  </span>
                )}

                {pad.cracked && (
                  <span className="mt-1 text-[10px] uppercase tracking-wider text-[#e9b58f]">
                    Cracked!
                  </span>
                )}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-[#9eaf9b]">
            Hop {hops} · Choose carefully. Cracked pads mean splash time!
          </p>
        </div>

        {gameOver ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold">Oh no, frog down!</h2>
            <p className="mt-2 text-sm text-[#c2d0b8]">
              You made {hops} hops and scored {score} points.
            </p>

            <button
              type="button"
              onClick={restart}
              className="mt-5 rounded-full bg-[#e9b58f] px-7 py-3 font-bold text-[#26382d] transition hover:scale-105"
            >
              Hop again ↻
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => move(-1)}
                className="rounded-full border border-[#829b75]/40 bg-[#17251e] px-5 py-3 text-xl hover:bg-[#405a43]"
                aria-label="Move left"
              >
                ←
              </button>

              <button
                type="button"
                onClick={hop}
                className="rounded-full bg-[#e9b58f] px-9 py-3 font-black text-[#26382d] shadow-lg transition hover:scale-105 active:scale-95"
              >
                HOP! 🐸
              </button>

              <button
                type="button"
                onClick={() => move(1)}
                className="rounded-full border border-[#829b75]/40 bg-[#17251e] px-5 py-3 text-xl hover:bg-[#405a43]"
                aria-label="Move right"
              >
                →
              </button>
            </div>

            <p className="text-center text-xs text-[#9eaf9b]">
              Keyboard: ← → to choose · SPACE to hop
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#829b75]/20 pt-5 text-xs text-[#9eaf9b]">
          <span>Made with questionable frog decisions.</span>
          <a
            href="/"
            className="shrink-0 text-[#e9b58f] transition hover:text-white"
          >
            ← Back to my world
          </a>
        </div>
      </section>
    </main>
  )
}
