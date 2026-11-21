import { Footer } from './components/layout/Footer'
import { Navbar } from './components/layout/Navbar'
import { About } from './components/sections/About'
import { Achievements } from './components/sections/Achievements'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'

export default function App() {
  return (
    <div className="relative min-h-screen bg-parchment">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
