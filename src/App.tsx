
import { useState } from 'react'

import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'

import { About } from './components/sections/About'
import { Achievements } from './components/sections/Achievements'
import { CodingActivity } from './components/sections/CodingActivity'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'

import { CreekWorld } from './components/scene/CreekWorld'
import { ScrollJourney } from './components/scene/ScrollJourney'
import { JourneyProgressContext } from './components/scene/journeyProgress'

import { CursorFrog } from './components/ui/CursorFrog'

export default function App() {
  const [progress, setProgress] = useState(0)

  return (
    <JourneyProgressContext.Provider value={{ progress, setProgress }}>
      <div className="relative min-h-screen overflow-clip bg-transparent">

        {/* Continuous 3D cottage world */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <CreekWorld />
        </div>

        {/* Scroll-controlled camera journey */}
        <ScrollJourney />

        {/* Portfolio content */}
        <div className="relative z-10">
          <Navbar />

          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Achievements />
            <CodingActivity />
            <Contact />
          </main>

          <Footer />
        </div>

        {/* Little frog with a cursor-chasing tongue 🐸 */}
        <CursorFrog />

      </div>
    </JourneyProgressContext.Provider>
  )
}
