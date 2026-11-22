
export const navSections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof navSections)[number]['id']

export const profile = {
  name: 'Aditi Singh',
  title: 'Developer, learner & professional zoned-out human.',
  tagline: 'A little curiosity, a little creativity, and a suspicious number of browser tabs.',
  degree: 'B.E.',
  branch: 'Computer Science and Engineering',
  college: 'NIE, Mysore',
  graduation: '2030',
  intro: [
    "Hey, I'm Aditi! A Computer Science student who enjoys turning random ideas into projects and curiosity into code.",
    "I love exploring technology, experimenting with new ideas and building things that feel a little different. Sometimes I'm coding, sometimes I'm learning something new, and sometimes my brain is simply buffering. Either way, there's usually another idea waiting to be explored.",
  ],
  traits: ['Curious', 'Creative', 'Always experimenting', 'Occasionally buffering'],
  interests: ['Anime', 'Music', 'Space & Science', 'Technology'],
}

export const contact = {
  email: 'iamaditisingh.04@gmail.com',
  github: {
    label: 'GitHub',
    handle: 'iamaditisingh04-png',
    url: 'https://github.com/iamaditisingh04-png',
  },
  linkedin: {
    label: 'LinkedIn',
    handle: 'aditi-singh',
    url: 'https://www.linkedin.com/in/aditi-singh-31231a327/',
  },
  resume: {
    label: 'Résumé',
    url: '',
  },
}

export type Project = {
  name: string
  note: string
  repo: string
}

export const projects: Project[] = [
  {
    name: 'Software & Development',
    note: 'Ideas that refused to stay ideas.',
    repo: '',
  },
  {
    name: 'Artificial Intelligence',
    note: 'Experimenting with systems that can learn, reason and surprise me.',
    repo: '',
  },
  {
    name: 'Creative Technology',
    note: 'Building interfaces and little digital worlds with personality.',
    repo: '',
  },
]

export const learningPaths = [
  {
    title: 'Programming & Software',
    blurb:
      'From solving problems to building applications. Learning how to turn a blank editor into something that actually works — bugs included.',
    accent: 'leaf' as const,
  },
  {
    title: 'Artificial Intelligence',
    blurb:
      'Exploring how machines learn, reason and make sense of the world. Equal parts curiosity, experiments and fascinating possibilities.',
    accent: 'turquoise' as const,
  },
  {
    title: 'Creative Technology',
    blurb:
      'Where design meets code. Creating interactive experiences, thoughtful interfaces and digital spaces that feel alive.',
    accent: 'blush' as const,
  },
  {
    title: 'Learning by Building',
    blurb:
      'Projects, hackathons, challenges and occasional debugging marathons. The best lessons usually come from making something real.',
    accent: 'sun' as const,
  },
]

export const timeline = [
  {
    year: '2026',
    title: 'Started my B.E. in Computer Science and Engineering',
    place: 'NIE, Mysore',
  },
  {
    year: 'Now',
    title: 'Learning, building and figuring things out',
    place: 'Code · Projects · Hackathons · Experiments',
  },
  {
    year: '2030',
    title: 'Expected graduation',
    place: 'Class of 2030',
  },
]
