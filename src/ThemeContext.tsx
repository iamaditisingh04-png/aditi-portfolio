
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type WorldTheme = 'day' | 'night'

type ThemeContextType = {
  theme: WorldTheme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<WorldTheme>('day')

  const toggleTheme = () => {
    setTheme((current) => (current === 'day' ? 'night' : 'day'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useWorldTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useWorldTheme must be used inside ThemeProvider')
  }

  return context
}
