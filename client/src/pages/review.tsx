import { useState, useMemo } from "react";
import { Music, MapPin, Star, Calendar, TrendingUp, Award, Users, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useStats, useCalendar } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, subtext }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-macaron-sm border-2 border-macaron-rose-pale/30">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-macaron-rose" />
        <span className="text-xs text-macaron-cocoa font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-macaron-text-primary font-display">{value}</div>
      {subtext && <div className="text-[11px] text-macaron-cocoa mt-0.5">{subtext}</div>}
    </div>
  );
}

function WordCloud({ words }: { words: [string, number][] }) {
  const maxCount = Math.max(...words.map(([, c]) => c), 1);
  const sorted = words.sort((a, b) => b[1] - a[1]).slice(0, 20);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-macaron-sm border-2 border-macaron-rose-pale/30">
      <h3 className="font-display text-base font-bold text-macaron-text-primary mb-3">Artist Word Cloud</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {sorted.map(([word, count]) => {
          const size = 0.7 + (count / maxCount) * 1.3;
          const opacity = 0.5 + (count / maxCount) * 0.5;
          const colors = [
            "text-macaron-rose",
            "text-macaron-mint",
            "text-macaron-lavender",
            "text-macaron-peach",
            "text-macaron-periwinkle",
            "text-macaron-cocoa",
          ];
          const color = colors[word.length % colors.length];
          return (
            <span
              key={word}
              className={cn("font-display font-bold", color)}
              style={{ fontSize: `${size}rem`, opacity }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function CalendarView({ year, month, onPrev, onNext }: { year: number; month: number; onPrev: () => void; onNext: () => void }) {
  const { data: calendarDays = [] } = useCalendar(year, month);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-macaron-sm border-2 border-macaron-rose-pale/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-base font-bold text-macaron-text-primary">Show Calendar</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="w-7 h-7 rounded-full bg-macaron-shell flex items-center justify-center text-macaron-cocoa hover:bg-macaron-rose-pale transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm text-macaron-text-primary font-semibold min-w-[80px] text-center">{monthNames[month - 1]} {year}</span>
          <button
            onClick={onNext}
            className="w-7 h-7 rounded-full bg-macaron-shell flex items-center justify-center text-macaron-cocoa hover:bg-macaron-rose-pale transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs text-macaron-cocoa font-semibold py-1">{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {calendarDays.map((day) => (
          <div
            key={day.date}
            className={cn(
              "aspect-square rounded-xl flex items-center justify-center text-xs relative font-medium",
              day.hasShow
                ? "bg-macaron-rose-pale text-macaron-rose font-bold"
                : "text-macaron-cocoa hover:bg-macaron-shell"
            )}
          >
            {day.date.split("-")[2]}
            {day.shows.some((s) => s.isUpcoming) && (
              <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-macaron-mint" />
            )}
            {day.shows.some((s) => !s.isUpcoming) && day.hasShow && (
              <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-macaron-rose" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-[10px] text-macaron-cocoa">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-macaron-rose" /> Attended
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-macaron-mint" /> Upcoming
        </span>
      </div>
    </div>
  );
}

function TimelineView() {
  const { data: stats } = useStats();
  const months = useMemo(() => {
    if (!stats?.monthlyDistribution) return [];
    return Object.entries(stats.monthlyDistribution)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12);
  }, [stats]);

  const maxCount = Math.max(...months.map(([, c]) => c), 1);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-macaron-sm border-2 border-macaron-rose-pale/30">
      <h3 className="font-display text-base font-bold text-macaron-text-primary mb-3">Monthly Timeline</h3>
      {months.length > 0 ? (
        <div className="space-y-2">
          {months.map(([month, count]) => (
            <div key={month} className="flex items-center gap-3">
              <span className="text-xs text-macaron-cocoa w-14 font-medium">{month}</span>
              <div className="flex-1 h-5 bg-macaron-shell rounded-full overflow-hidden">
                <div
                  className="h-full bg-macaron-rose rounded-full transition-all duration-500"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-macaron-cocoa w-4 font-bold">{count}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-macaron-cocoa text-center py-4">No data yet</p>
      )}
    </div>
  );
}

export function ReviewPage() {
  const { data: stats, isLoading } = useStats();
  const now = new Date();
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth() + 1);

  const handlePrevMonth = () => {
    if (calendarMonth === 1) {
      setCalendarMonth(12);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarMonth(1);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const artistWords = useMemo(() => {
    if (!stats?.artistFrequency) return [];
    return Object.entries(stats.artistFrequency);
  }, [stats]);

  return (
    <div className="min-h-screen pb-24 bg-macaron-vanilla overflow-x-hidden">
      <header className="px-6 pt-10 pb-3">
        <h1 className="font-display text-2xl font-bold text-macaron-text-primary">Insights</h1>
        <p className="text-sm text-macaron-cocoa mt-1 font-medium">Your show journey at a glance</p>
      </header>

      {isLoading ? (
        <div className="text-center py-12 text-macaron-cocoa">Loading...</div>
      ) : stats ? (
        <div className="px-6 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={Music} label="Total Shows" value={stats.totalShows} />
            <StatCard icon={Users} label="Artists" value={stats.totalArtists} />
            <StatCard icon={Building2} label="Venues" value={stats.totalVenues} />
            <StatCard icon={MapPin} label="Cities" value={stats.totalCities} />
          </div>

          {/* Rating & This Year */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Star}
              label="Avg Rating"
              value={stats.averageRating?.toFixed(1) || "-"}
              subtext="out of 10"
            />
            <StatCard
              icon={TrendingUp}
              label="This Year"
              value={stats.thisYearShows}
              subtext={`${stats.thisMonthShows} this month`}
            />
          </div>

          {/* Calendar */}
          <CalendarView year={calendarYear} month={calendarMonth} onPrev={handlePrevMonth} onNext={handleNextMonth} />

          {/* Timeline */}
          <TimelineView />

          {/* Word Cloud */}
          {artistWords.length > 0 && (
            <WordCloud words={artistWords} />
          )}

          {/* Genre Distribution */}
          {Object.keys(stats.genreDistribution).length > 0 && (
            <div className="bg-white rounded-3xl p-5 shadow-macaron-sm border-2 border-macaron-rose-pale/30">
              <h3 className="font-display text-base font-bold text-macaron-text-primary mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.genreDistribution).map(([genre, count]) => (
                  <span
                    key={genre}
                    className="px-3 py-1.5 rounded-full text-xs bg-macaron-rose-pale text-macaron-rose font-bold"
                  >
                    {genre} · {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award size={36} className="mx-auto text-macaron-rose-pale mb-3" />
          <p className="text-sm text-macaron-cocoa font-medium">No show data yet</p>
          <p className="text-xs text-macaron-cocoa mt-1">Add shows to see your insights</p>
        </div>
      )}
    </div>
  );
}
