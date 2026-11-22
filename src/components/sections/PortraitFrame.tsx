
export function PortraitFrame() {
  return (
    <div className="pointer-events-none relative mx-auto w-full max-w-[170px] sm:max-w-[190px] lg:max-w-[210px]">
      <img
        src="/images/aditi-character-cutout.png"
        alt="Illustrated Aditi"
        draggable={false}
        className="h-auto w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
        style={{
          animation: 'aditi-float 4s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes aditi-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
      `}</style>
    </div>
  )
}
