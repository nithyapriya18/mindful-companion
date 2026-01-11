import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { getMoodLogs, logMood, MoodLog, MoodType } from '@/services/moodService'
import { 
  isSameDay, 
  format, 
  startOfWeek,
  eachDayOfInterval, 
  subDays,
  getDay,
  isAfter,
  parseISO
} from 'date-fns'
import { Calendar, TrendingUp, X } from 'lucide-react'
import { ResponsiveContainer, Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

const moodColors = {
  struggling: 'bg-red-500 dark:bg-red-600',
  low: 'bg-orange-500 dark:bg-orange-600',
  okay: 'bg-yellow-500 dark:bg-yellow-600',
  good: 'bg-green-500 dark:bg-green-600',
  great: 'bg-blue-500 dark:bg-blue-600',
}

const moodValues = {
  struggling: 1,
  low: 2,
  okay: 3,
  good: 4,
  great: 5,
}

const moodEmojis = {
  struggling: '😰',
  low: '😕',
  okay: '😐',
  good: '🙂',
  great: '😊',
}

const moodLabels = {
  struggling: 'Struggling',
  low: 'Low',
  okay: 'Okay',
  good: 'Good',
  great: 'Great',
}

type ViewMode = 'calendar' | 'graph'
type TimeRange = '1m' | '3m' | '6m' | '1y'

export function MoodCalendar() {
  const { user } = useAuth()
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [timeRange, setTimeRange] = useState<TimeRange>('1y')

  useEffect(() => {
    if (user) {
      loadMoodLogs()
    }
  }, [user, timeRange])

  async function loadMoodLogs() {
    if (!user) return

    setLoading(true)
    try {
      const { start, end } = getDateRange()
      const logs = await getMoodLogs(user.id, start, end)
      setMoodLogs(logs)
    } catch (error) {
      console.error('Failed to load mood logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateRange = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let start: Date
    
    if (timeRange === '1m') {
      start = subDays(today, 30)
    } else if (timeRange === '3m') {
      start = subDays(today, 90)
    } else if (timeRange === '6m') {
      start = subDays(today, 180)
    } else {
      start = subDays(today, 365)
    }
    
    return { start, end: today }
  }

  const generateCalendarData = () => {
    const { start, end } = getDateRange()
    const calendarStart = startOfWeek(start, { weekStartsOn: 0 })
    const allDays = eachDayOfInterval({ start: calendarStart, end })
    
    const rows: (Date | null)[][] = Array(7).fill(null).map(() => [])
    
    allDays.forEach(day => {
      const dayOfWeek = getDay(day)
      rows[dayOfWeek].push(day)
    })
    
    const maxLength = Math.max(...rows.map(row => row.length))
    rows.forEach(row => {
      while (row.length < maxLength) {
        row.push(null)
      }
    })
    
    return { rows, numWeeks: maxLength, start, end }
  }

  const getMonthLabels = (rows: (Date | null)[][], start: Date) => {
    if (rows.length === 0 || rows[0].length === 0) return []
    
    const labels: { month: string; columnIndex: number }[] = []
    let lastMonth = -1
    
    rows[0].forEach((day, colIndex) => {
      if (day && day >= start) {
        const month = day.getMonth()
        
        if (month !== lastMonth) {
          labels.push({
            month: format(day, 'MMM'),
            columnIndex: colIndex,
          })
          lastMonth = month
        }
      }
    })
    
    return labels
  }

  const generateGraphData = () => {
    const { start, end } = getDateRange()
    const allDays = eachDayOfInterval({ start, end })
    
    return allDays
      .map(day => {
        const mood = moodLogs.find(log => isSameDay(parseISO(log.logged_at), day))
        return {
          date: format(day, 'MMM d'),
          fullDate: format(day, 'EEE, MMM d, yyyy'),
          value: mood ? moodValues[mood.mood as keyof typeof moodValues] : null,
          mood: mood?.mood || null,
          hasData: !!mood
        }
      })
      .filter(d => d.hasData)
  }

  const { rows, numWeeks, start, end } = generateCalendarData()
  const monthLabels = getMonthLabels(rows, start)
  const graphData = generateGraphData()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getMoodForDay = (day: Date | null) => {
    if (!day) return null
    return moodLogs.find(log => isSameDay(parseISO(log.logged_at), day))
  }

  const handleDayClick = (day: Date) => {
    const isFuture = isAfter(day, today)
    if (isFuture) return
    
    setSelectedDay(day)
  }

  const handleMoodSelect = async (mood: MoodType) => {
    if (!user || !selectedDay) return

    setSaving(true)
    try {
      // Pass the selected date to logMood
      await logMood(user.id, mood, selectedDay)
      await loadMoodLogs()
      setSelectedDay(null)
    } catch (error) {
      console.error('Failed to log mood:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg mb-1">Daily Mood Tracker</CardTitle>
            <p className="text-xs text-muted-foreground">
              {format(start, 'MMM d, yyyy')} - {format(end, 'MMM d, yyyy')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="graph" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Graph
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-1">
              {(['1m', '3m', '6m', '1y'] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="text-xs px-3 h-8"
                >
                  {range === '1m' ? '1M' : range === '3m' ? '3M' : range === '6m' ? '6M' : '1Y'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
        ) : viewMode === 'calendar' ? (
          <div className="space-y-4">
            <div className="w-full">
              <div className="flex items-center mb-3 h-5">
                <div className="w-12 flex-shrink-0"></div>
                <div className="flex-1 relative">
                  {monthLabels.map((label, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-semibold text-muted-foreground absolute"
                      style={{ left: `${(label.columnIndex / numWeeks) * 100}%` }}
                    >
                      {label.month}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex flex-col gap-1 w-12 flex-shrink-0">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                    <div key={day} className="text-xs text-muted-foreground text-right pr-2 h-3 leading-3">
                      {idx % 2 === 0 ? day : ''}
                    </div>
                  ))}
                </div>

                <div className="flex-1 space-y-1">
                  {rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-1">
                      {row.map((day, colIdx) => {
                        if (!day) {
                          return <div key={colIdx} className="flex-1 h-3" />
                        }

                        const mood = getMoodForDay(day)
                        const isToday = isSameDay(day, today)
                        const isSelected = selectedDay && isSameDay(day, selectedDay)
                        const isFuture = isAfter(day, today)
                        const isBeforeRange = day < start

                        if (isBeforeRange) {
                          return <div key={colIdx} className="flex-1 h-3 opacity-0" />
                        }

                        if (isFuture) {
                          return (
                            <div
                              key={colIdx}
                              className="flex-1 h-3 rounded-sm bg-muted/20 cursor-not-allowed opacity-30"
                              title={`${format(day, 'EEE, MMM d, yyyy')}: Future date`}
                            />
                          )
                        }

                        return (
                          <div
                            key={colIdx}
                            onClick={() => handleDayClick(day)}
                            className={`
                              flex-1 h-3 rounded-sm cursor-pointer transition-all relative
                              ${mood ? moodColors[mood.mood as keyof typeof moodColors] : 'bg-muted/40 dark:bg-muted/60'}
                              ${isToday ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}
                              ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background scale-125 z-20' : ''}
                              hover:ring-2 hover:ring-primary/70 hover:scale-110 hover:z-10
                            `}
                            title={`${format(day, 'EEE, MMM d, yyyy')}${mood ? `: ${moodLabels[mood.mood as keyof typeof moodLabels]}` : ': Click to log mood'}`}
                            onMouseEnter={() => setHoveredDay(day)}
                            onMouseLeave={() => setHoveredDay(null)}
                          >
                            {isToday && !isSelected && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full ring-1 ring-background" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Day Mood Selector */}
            {selectedDay && (
              <div className="p-4 bg-muted/50 rounded-lg border-2 border-primary animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">
                    Log mood for {format(selectedDay, 'EEEE, MMM d, yyyy')}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedDay(null)}
                    className="h-6 w-6"
                    disabled={saving}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <button
                      key={mood}
                      onClick={() => handleMoodSelect(mood as MoodType)}
                      disabled={saving}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-background transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className={`w-10 h-10 rounded-md ${moodColors[mood as keyof typeof moodColors]} flex items-center justify-center text-xl shadow-sm`}>
                        {emoji}
                      </div>
                      <p className="text-xs font-medium text-center">{moodLabels[mood as keyof typeof moodLabels]}</p>
                    </button>
                  ))}
                </div>
                {saving && (
                  <p className="text-xs text-muted-foreground text-center mt-2">Saving...</p>
                )}
              </div>
            )}

            {/* Hover tooltip */}
            {hoveredDay && !selectedDay && (
              <div className="p-3 bg-muted rounded-lg text-sm font-medium">
                {format(hoveredDay, 'EEE, MMM d, yyyy')}
                {getMoodForDay(hoveredDay) && (
                  <>: {moodLabels[getMoodForDay(hoveredDay)!.mood as keyof typeof moodLabels]} {moodEmojis[getMoodForDay(hoveredDay)!.mood as keyof typeof moodEmojis]}</>
                )}
                {!getMoodForDay(hoveredDay) && ': Click to log mood'}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {graphData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No mood data to display. Start logging your mood to see trends!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={graphData}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'currentColor' }} />
                  <YAxis 
                    domain={[0, 6]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(value) => ['', 'Struggling', 'Low', 'Okay', 'Good', 'Great'][value] || ''}
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="text-sm font-medium">{data.fullDate}</p>
                            <p className="text-sm text-muted-foreground">
                              {moodLabels[data.mood as keyof typeof moodLabels]} {moodEmojis[data.mood as keyof typeof moodEmojis]}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="url(#moodGradient)"
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {/* Mood Scale - Only show when no day is selected */}
        {!selectedDay && (
          <div className="pt-4 border-t border-border mt-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Mood Scale</p>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(moodEmojis).map(([mood, emoji]) => (
                <div key={mood} className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-7 h-7 rounded-md ${moodColors[mood as keyof typeof moodColors]} flex items-center justify-center text-base shadow-sm`}>
                    {emoji}
                  </div>
                  <p className="text-xs font-medium text-center">{moodLabels[mood as keyof typeof moodLabels]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {moodLogs.length > 0 && (
          <div className="pt-3 border-t border-border mt-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-2 rounded-lg bg-muted/30 text-center">
                <div className="text-xl font-bold">{moodLogs.length}</div>
                <div className="text-xs text-muted-foreground">Days Logged</div>
              </div>
              <div className="p-2 rounded-lg bg-muted/30 text-center">
                <div className="text-xl font-bold">{moodEmojis[moodLogs[0].mood as keyof typeof moodEmojis]}</div>
                <div className="text-xs text-muted-foreground">Most Recent</div>
              </div>
              <div className="p-2 rounded-lg bg-muted/30 text-center">
                <div className="text-xl font-bold">
                  {(moodLogs.reduce((sum, log) => sum + moodValues[log.mood as keyof typeof moodValues], 0) / moodLogs.length).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
              <div className="p-2 rounded-lg bg-muted/30 text-center">
                <div className="text-xl font-bold">
                  {(() => {
                    const counts = moodLogs.reduce((acc, log) => {
                      acc[log.mood] = (acc[log.mood] || 0) + 1
                      return acc
                    }, {} as Record<string, number>)
                    const most = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
                    return moodEmojis[most[0] as keyof typeof moodEmojis]
                  })()}
                </div>
                <div className="text-xs text-muted-foreground">Most Common</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}