
import { useEffect, useMemo, useState } from 'react'

type Platform = 'github' | 'leetcode' | 'codechef'

type ActivityDay = {
  date: string
  count: number
}

type ActivityState = {
  days: ActivityDay[]
  loading: boolean
  error: string | null
  total: number
}

const CONFIG = {
  github: {
    title: 'GitHub',
    username: 'iamaditisingh04-png',
    url: 'https://github.com/iamaditisingh04-png',
    colors: ['#263b30', '#54a875', '#35c477', '#18e879', '#a2ffc9'],
    endpoint:
      'https://github-contributions-api.jogruber.de/v4/iamaditisingh04-png?y=last',
  },

  leetcode: {
    title: 'LeetCode',
    username: 'iamaditisingh04-png',
    url: 'https://leetcode.com/u/iamaditisingh04-png/',
    colors: ['#49331f', '#a96d2c', '#e69a38', '#ffb84d', '#ffe0a3'],
    endpoint: 'https://proxy.cors.dev/https://leetcode.com/graphql',
  },

  codechef: {
    title: 'CodeChef',
    username: 'nie_aditi3',
    url: 'https://www.codechef.com/users/nie_aditi3',
    colors: ['#492820', '#a84c39', '#d86a50', '#ff896b', '#ffc0a9'],
    endpoint:
      'https://codechef-stats.tashif.codes/nie_aditi3/heatmap?view=last_365',
  },
} as const

const initialState: ActivityState = {
  days: [],
  loading: true,
  error: null,
  total: 0,
}

const SIX_MONTHS = 183

function makeDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getRecentDays(days: ActivityDay[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() - SIX_MONTHS + 1)

  const activityMap = new Map<string, number>()

  days.forEach((day) => {
    const date = new Date(`${day.date}T00:00:00`)

    if (Number.isNaN(date.getTime())) return

    const key = makeDateString(date)
    activityMap.set(key, (activityMap.get(key) ?? 0) + day.count)
  })

  const completeDays: ActivityDay[] = []

  for (
    const date = new Date(cutoff);
    date <= today;
    date.setDate(date.getDate() + 1)
  ) {
    const key = makeDateString(date)

    completeDays.push({
      date: key,
      count: activityMap.get(key) ?? 0,
    })
  }

  return completeDays
}

function getLevel(count: number) {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

function ActivityCalendar({
  platform,
  state,
}: {
  platform: Platform
  state: ActivityState
}) {
  const config = CONFIG[platform]

  const calendar = useMemo(() => {
    if (state.days.length === 0) return []

    const firstDate = new Date(`${state.days[0].date}T00:00:00`)

    // Monday-first calendar
    const offset = (firstDate.getDay() + 6) % 7

    const padded: (ActivityDay | null)[] = [
      ...Array.from({ length: offset }, () => null),
      ...state.days,
    ]

    const weeks: (ActivityDay | null)[][] = []

    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7))
    }

    return weeks
  }, [state.days])

  const monthLabels = useMemo(() => {
    const labels: { label: string; column: number }[] = []
    let previousMonth = ''

    calendar.forEach((week, index) => {
      const firstDay = week.find((day) => day !== null)

      if (!firstDay) return

      const month = firstDay.date.slice(0, 7)

      if (month !== previousMonth) {
        labels.push({
          label: new Date(`${firstDay.date}T00:00:00`).toLocaleString(
            'en',
            { month: 'short' },
          ),
          column: index,
        })

        previousMonth = month
      }
    })

    return labels
  }, [calendar])

  return (
    <article className="rounded-2xl border border-white/10 bg-[#26382d] p-4 shadow-[0_16px_45px_rgba(0,0,0,0.25)] transition duration-300 hover:border-[#829b75]/50 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl text-[#FFF8E8]">
            {config.title}
          </h3>

          <p className="mt-1 text-sm text-[#D0C5AC]">
            @{config.username}
          </p>
        </div>

        <a
          href={config.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/20 px-4 py-2 text-xs text-[#E9B58F] transition hover:border-white/35 hover:bg-white/10 hover:text-[#FFF8E8]"
        >
          Visit profile ↗
        </a>
      </div>

      <div className="mt-6">
        {state.loading ? (
          <p className="py-8 text-sm text-[#D0C5AC]">
            Gathering little coding footprints...
          </p>
        ) : state.error ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="font-display text-lg text-[#FFF8E8]">
              The activity calendar is taking a nap.
            </p>

            <p className="mt-1 text-sm text-[#D0C5AC]">
              {state.error}
            </p>
          </div>
        ) : (
          <>
            <div className="w-full">
              <div className="relative ml-8 mb-3 h-5">
                {monthLabels.map((month) => (
                  <span
                    key={`${month.label}-${month.column}`}
                    className="absolute text-[10px] text-[#D0C5AC] sm:text-xs"
                    style={{
                      left: `${(month.column / calendar.length) * 100}%`,
                    }}
                  >
                    {month.label}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <div className="flex w-6 shrink-0 flex-col justify-between py-0.5 text-[9px] text-[#D0C5AC] sm:w-7 sm:text-[10px]">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                </div>

                <div
                  className="grid min-w-0 flex-1 gap-[3px]"
                  style={{
                    gridTemplateColumns: `repeat(${calendar.length}, minmax(0, 1fr))`,
                  }}
                >
                  {calendar.map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="flex min-w-0 flex-col gap-[3px]"
                    >
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const day = week[dayIndex]

                        return (
                          <div
                            key={day?.date ?? `empty-${weekIndex}-${dayIndex}`}
                            title={
                              day
                                ? `${day.date}: ${day.count} activities`
                                : undefined
                            }
                            className="aspect-square w-full rounded-[2px] sm:rounded-[3px]"
                            style={{
                              backgroundColor: day
                                ? config.colors[getLevel(day.count)]
                                : 'transparent',
                              boxShadow:
                                day && day.count > 0
                                  ? '0 0 4px rgba(255,255,255,0.08)'
                                  : 'none',
                            }}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-[#D0C5AC] sm:text-xs">
              <span>
                {state.total.toLocaleString()} recorded activities · Last 6 months
              </span>

              <span className="flex items-center gap-1">
                Less

                {config.colors.map((color) => (
                  <span
                    key={color}
                    className="h-2.5 w-2.5 rounded-[2px] sm:h-3 sm:w-3"
                    style={{ backgroundColor: color }}
                  />
                ))}

                More
              </span>
            </div>
          </>
        )}
      </div>
    </article>
  )
}

async function fetchGitHub(): Promise<ActivityDay[]> {
  const response = await fetch(CONFIG.github.endpoint)

  if (!response.ok) {
    throw new Error('GitHub activity could not be loaded.')
  }

  const data = await response.json()

  return (data.contributions ?? []).map(
    (item: { date: string; count: number }) => ({
      date: item.date,
      count: Number(item.count) || 0,
    }),
  )
}

async function fetchLeetCode(): Promise<ActivityDay[]> {
  const query = `
    query userCalendar($username: String!) {
      matchedUser(username: $username) {
        userCalendar {
          submissionCalendar
        }
      }
    }
  `

  const params = new URLSearchParams({
    query,
    variables: JSON.stringify({
      username: CONFIG.leetcode.username,
    }),
  })

  const response = await fetch(
    `${CONFIG.leetcode.endpoint}?${params.toString()}`,
  )

  if (!response.ok) {
    throw new Error('LeetCode activity could not be loaded.')
  }

  const result = await response.json()

  const calendar =
    result.data?.matchedUser?.userCalendar?.submissionCalendar

  if (!calendar) {
    throw new Error('LeetCode calendar was not returned.')
  }

  const parsed =
    typeof calendar === 'string' ? JSON.parse(calendar) : calendar

  return Object.entries(parsed).map(([timestamp, count]) => ({
    date: makeDateString(new Date(Number(timestamp) * 1000)),
    count: Number(count) || 0,
  }))
}

async function fetchCodeChef(): Promise<ActivityDay[]> {
  const response = await fetch(CONFIG.codechef.endpoint)

  if (!response.ok) {
    throw new Error('CodeChef activity could not be loaded.')
  }

  const result = await response.json()

  if (result.status !== 'success') {
    throw new Error(result.message || 'CodeChef data is unavailable.')
  }

  // The verified CodeChef API returns dailyContributions.
  const contributions = result.data?.dailyContributions ?? []

  return contributions.map(
    (item: { date: string; count: number }) => ({
      date: item.date,
      count: Number(item.count) || 0,
    }),
  )
}

export function CodingActivity() {
  const [activity, setActivity] = useState<
    Record<Platform, ActivityState>
  >({
    github: initialState,
    leetcode: initialState,
    codechef: initialState,
  })

  useEffect(() => {
    let cancelled = false

    const loaders: Record<Platform, () => Promise<ActivityDay[]>> = {
      github: fetchGitHub,
      leetcode: fetchLeetCode,
      codechef: fetchCodeChef,
    }

    const load = async (platform: Platform) => {
      try {
        const result = await loaders[platform]()
        const days = getRecentDays(result)

        if (cancelled) return

        setActivity((previous) => ({
          ...previous,
          [platform]: {
            days,
            loading: false,
            error: null,
            total: days.reduce((sum, day) => sum + day.count, 0),
          },
        }))
      } catch (error) {
        if (cancelled) return

        setActivity((previous) => ({
          ...previous,
          [platform]: {
            days: [],
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : 'Activity data is temporarily unavailable.',
            total: 0,
          },
        }))
      }
    }

    load('github')
    load('leetcode')
    load('codechef')

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="relative mx-auto w-full max-w-4xl bg-[#17251e] px-5 py-20 sm:px-8">
      <div className="mb-12 text-center">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#E9B58F]">
          A little progress, one day at a time
        </p>

        <h2 className="mt-3 font-display text-3xl text-[#FFF8E8] sm:text-4xl">
          My Coding Footprints
        </h2>

        <p className="mt-3 font-display italic text-[#E8DCC4]">
          Me vs. the problems. The problems are putting up a fight.
        </p>
      </div>

      <div className="flex flex-col gap-7">
        <ActivityCalendar
          platform="github"
          state={activity.github}
        />

        <ActivityCalendar
          platform="leetcode"
          state={activity.leetcode}
        />

        <ActivityCalendar
          platform="codechef"
          state={activity.codechef}
        />
      </div>
    </section>
  )
}
