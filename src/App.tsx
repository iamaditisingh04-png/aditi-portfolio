
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

import { FrogHop } from './components/ui/FrogHop'

export default function App() {
  const [progress, setProgress] = useState(0)

  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  const portfolioPaths = [
    '/',
    '/index.html',
    '/about',
    '/skills',
    '/projects',
    '/achievements',
    '/coding',
    '/contact',
  ]

  const isPortfolio = portfolioPaths.includes(path)

  if (!isPortfolio) {
    return <FrogHop />
  }

  return (
    <JourneyProgressContext.Provider value={{ progress, setProgress }}>
      <div className="relative min-h-screen overflow-clip bg-transparent">
        <div className="pointer-events-none fixed inset-0 z-0">
          <CreekWorld />
        </div>

        <ScrollJourney />

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
      </div>
    </JourneyProgressContext.Provider>
  )
}
