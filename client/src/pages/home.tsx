import { useState } from "react";
import { Plus, Music, MapPin, Calendar, Star, Camera } from "lucide-react";
import { useShows, useCountdown } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import type { Show, CountdownItem } from "@shared/schema";

function CountdownCard({ item }: { item: CountdownItem }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-macaron-sm border-2 border-macaron-rose-pale/50 flex-shrink-0 w-44">
      <div className="text-4xl font-bold text-macaron-rose font-display mb-1">
        {item.daysLeft}
        <span className="text-sm font-semibold text-macaron-cocoa ml-1">days</span>
      </div>
      <h3 className="font-display font-bold text-macaron-text-primary text-sm line-clamp-1 mb-0.5">{item.title}</h3>
      {item.artist && (
        <p className="text-xs text-macaron-cocoa line-clamp-1">{item.artist}</p>
      )}
      {item.venue && (
        <p className="text-[11px] text-macaron-cocoa mt-1 flex items-center gap-1">
          <MapPin size={10} /> {item.venue}
        </p>
      )}
    </div>
  );
}

function ShowCard({ show, onClick }: { show: Show; onClick?: () => void }) {
  const genreColors: Record<string, string> = {
    pop: "bg-macaron-rose-pale text-macaron-rose",
    rock: "bg-macaron-mint-light text-macaron-mint",
    jazz: "bg-macaron-lemon-light text-macaron-cocoa",
    classical: "bg-macaron-lavender-light text-macaron-lavender",
    electronic: "bg-macaron-periwinkle-light text-macaron-periwinkle",
    folk: "bg-macaron-peach-light text-macaron-peach",
  };
  const genreKey = show.genre?.toLowerCase() || "";
  const badgeClass = genreColors[genreKey] || "bg-macaron-rose-pale text-macaron-rose";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl p-5 shadow-macaron-sm border-2 border-macaron-rose-pale/30 cursor-pointer transition-all duration-200 hover:shadow-macaron-lg hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-macaron-text-primary text-base line-clamp-1">{show.title}</h3>
          {show.artist && (
            <p className="text-sm text-macaron-cocoa mt-0.5 flex items-center gap-1">
              <Music size={12} className="text-macaron-rose" /> {show.artist}
            </p>
          )}
        </div>
        {show.rating && (
          <div className="flex items-center gap-0.5 text-macaron-peach">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold">{show.rating}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-macaron-cocoa">
        <span className="flex items-center gap-1">
          <Calendar size={11} /> {show.showDate}
        </span>
        {show.venue && (
          <span className="flex items-center gap-1">
            <MapPin size={11} /> {show.venue}
          </span>
        )}
      </div>
      {show.genre && (
        <span className={cn("inline-block mt-2 text-[11px] px-3 py-1 rounded-full font-semibold", badgeClass)}>
          {show.genre}
        </span>
      )}
      {show.isUpcoming && (
        <span className="inline-block mt-2 ml-2 text-[10px] px-2 py-0.5 rounded-full bg-macaron-mint-light text-macaron-mint font-semibold">
          Upcoming
        </span>
      )}
    </div>
  );
}

interface HomePageProps {
  onNavigate: (tab: string, showId?: number, action?: string, filter?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { data: shows = [] } = useShows();
  const { data: countdown = [] } = useCountdown();
  const recentShows = shows.filter((s) => !s.isUpcoming).sort((a, b) => new Date(b.showDate).getTime() - new Date(a.showDate).getTime()).slice(0, 3);
  const upcomingShows = shows.filter((s) => s.isUpcoming).sort((a, b) => new Date(a.showDate).getTime() - new Date(b.showDate).getTime()).slice(0, 3);

  return (
    <div className="min-h-screen pb-24 bg-macaron-vanilla overflow-x-hidden">
      {/* Header */}
      <header className="px-6 pt-10 pb-5">
        <h1 className="font-hand text-4xl text-macaron-rose mb-1">Livebook</h1>
        <p className="text-sm text-macaron-cocoa font-medium">Your personal show journal</p>
      </header>

      {/* Countdown */}
      {countdown.length > 0 && (
        <section className="mb-6">
          <div className="px-6 mb-3">
            <h2 className="font-display text-lg font-bold text-macaron-text-primary">Countdown</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-6 scrollbar-hide pb-1">
            {countdown.map((item) => (
              <CountdownCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Shows */}
      {upcomingShows.length > 0 && (
        <section className="mb-6 px-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-macaron-text-primary">Upcoming</h2>
            <button
              onClick={() => onNavigate("shows", undefined, undefined, "upcoming")}
              className="text-xs text-macaron-rose font-semibold hover:text-macaron-rose-light"
            >
              See all
            </button>
          </div>
          <div className="grid gap-3">
            {upcomingShows.map((show) => (
              <ShowCard
                key={show.id}
                show={show}
                onClick={() => onNavigate("shows", show.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Shows */}
      <section className="mb-6 px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-macaron-text-primary">Recent</h2>
          <button
            onClick={() => onNavigate("shows", undefined, undefined, "past")}
            className="text-xs text-macaron-rose font-semibold hover:text-macaron-rose-light"
          >
            See all
          </button>
        </div>
        {recentShows.length > 0 ? (
          <div className="grid gap-3">
            {recentShows.map((show) => (
              <ShowCard
                key={show.id}
                show={show}
                onClick={() => onNavigate("shows", show.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-macaron-rose-pale/50">
            <Music size={36} className="mx-auto text-macaron-rose-pale mb-3" />
            <p className="text-sm text-macaron-cocoa font-medium">No shows yet</p>
            <p className="text-xs text-macaron-cocoa mt-1">Tap the button to add your first show</p>
          </div>
        )}
      </section>

      {/* FAB */}
      <button
        onClick={() => onNavigate("shows", undefined, "add")}
        className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-macaron-rose text-white shadow-macaron-pink flex items-center justify-center hover:bg-macaron-rose-soft transition-colors z-40"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
