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
  title: 'Computer Science Student',
  tagline: 'Turning curiosity into creativity through technology.',
  degree: 'B.E.',
  branch: 'Computer Science and Engineering',
  college: 'NIE, Mysore',
  graduation: '2030',
  intro: [
    "Hello! I'm Aditi, a Computer Science student who loves exploring technology, experimenting with ideas and building things.",
    'I\u2019m interested in programming, software development, artificial intelligence and creative technology. I enjoy learning by building, participating in technical activities and turning imaginative ideas into functional projects.',
  ],
  traits: ['Creative', 'Curious', 'Friendly', 'Professional'],
  interests: ['Anime', 'Music', 'Science', 'Technology'],
}

export const contact = {
  email: 'aditisingh.04@gmail.com',
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
  /**
   * Paste the hosted résumé PDF URL here once it is uploaded. While the URL is
   * empty the résumé control stays a non-clickable placeholder — no invented link.
   */
  resume: {
    label: 'Résumé',
    url: '',
  },
}

export type Project = {
  name: string
  note: string
  /** Repository URL. Leave empty to keep the editable “repository soon” placeholder. */
  repo: string
}

export const projects: Project[] = [
  { name: 'Software', note: 'Ideas becoming working things', repo: '' },
  { name: 'Artificial intelligence', note: 'Small experiments with learning systems', repo: '' },
  { name: 'Creative technology', note: 'Interfaces that feel alive', repo: '' },
]

export const learningPaths = [
  {
    title: 'Programming & Software',
    blurb:
      'Turning a blank editor into something that runs — algorithms, clean structure and the quiet joy of a bug finally understood.',
    accent: 'leaf' as const,
  },
  {
    title: 'Artificial Intelligence',
    blurb:
      'Curious about how machines learn, reason and imagine. Exploring the ideas behind intelligent systems, one experiment at a time.',
    accent: 'turquoise' as const,
  },
  {
    title: 'Creative Technology',
    blurb:
      'Where design meets code: interfaces, visuals and small interactive worlds that make technology feel warm and human.',
    accent: 'blush' as const,
  },
  {
    title: 'Learning by Building',
    blurb:
      'Workshops, technical activities and self-set challenges — the fastest way I know to grow is to make something real.',
    accent: 'sun' as const,
  },
]

export const timeline = [
  {
    year: '2026',
    title: 'Began B.E. in Computer Science and Engineering',
    place: 'NIE, Mysore',
  },
  {
    year: 'Now',
    title: 'Learning by building',
    place: 'Programming \u00b7 AI \u00b7 Creative technology',
  },
  {
    year: '2030',
    title: 'Expected graduation',
    place: 'Class of 2030',
  },
]
