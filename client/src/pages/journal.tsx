import { useState, useRef, useCallback, useMemo } from "react";
import { Plus, Calendar, Smile, Cloud, ImageIcon, X, Download, Share2, ChevronLeft, Edit3, Trash2, ChevronRight, Music, MapPin, Clock, Heart } from "lucide-react";
import { useJournals, useCreateJournal, useUpdateJournal, useDeleteJournal, useShows } from "@/hooks/use-api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Journal, CreateJournal, Show } from "@shared/schema";

const MOODS = ["Happy", "Moved", "Amazed", "Calm", "Excited", "Melancholy", "Healed", "Fired Up"];
const WEATHERS = ["Sunny", "Cloudy", "Overcast", "Rainy", "Snowy"];
const NOTE_CATEGORIES = ["Plan", "Moment", "Memory"] as const;

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Plan: { bg: "bg-macaron-mint-light", text: "text-macaron-mint-dark", border: "border-macaron-mint-light" },
  Moment: { bg: "bg-macaron-rose-pale", text: "text-macaron-rose", border: "border-macaron-rose-pale" },
  Memory: { bg: "bg-macaron-lemon-light", text: "text-macaron-lemon-dark", border: "border-macaron-lemon-light" },
};

function getCategoryColor(category: string | undefined | null) {
  if (category && CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  return CATEGORY_COLORS.Moment;
}

// ====== Show Card Component (Journal List) ======
function ShowCard({ show, notes, onClick }: { show: Show; notes: Journal[]; onClick: () => void }) {
  const showDate = new Date(show.showDate);
  const month = MONTH_NAMES[showDate.getMonth()];
  const day = showDate.getDate();

  const typeCounts = notes.reduce((acc, note) => {
    const cat = note.category || "Moment";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl overflow-hidden shadow-macaron-sm border-2 border-macaron-rose-pale/30 cursor-pointer transition-all duration-200 hover:shadow-macaron-lg hover:-translate-y-0.5"
    >
      {show.posterUrl && (
        <div className="relative aspect-[2/3] overflow-hidden">
          <img src={show.posterUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-macaron-rose">
            {notes.length} {notes.length === 1 ? "Note" : "Notes"}
          </div>
        </div>
      )}
      {!show.posterUrl && (
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-macaron-rose-pale/50 rounded-full text-xs font-bold text-macaron-rose">
              {notes.length} {notes.length === 1 ? "Note" : "Notes"}
            </span>
          </div>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-display font-bold text-macaron-text-primary text-lg line-clamp-1 mb-1">
          {show.title}
        </h3>

        {show.artist && (
          <p className="text-sm text-macaron-cocoa mb-2 flex items-center gap-1">
            <Heart size={12} className="text-macaron-rose" />
            {show.artist}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-macaron-cocoa mb-3">
          {show.venue && (
            <span className="flex items-center gap-1">
              <MapPin size={10} /> {show.venue}
            </span>
          )}
          {show.city && (
            <span className="flex items-center gap-1">
              <Clock size={10} /> {show.city}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xs text-macaron-cocoa font-medium">{month}</span>
          <span className="text-2xl font-display font-bold text-macaron-text-primary">{day}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {Object.entries(typeCounts).map(([type, count]) => {
            const color = getCategoryColor(type);
            return (
              <span
                key={type}
                className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", color.bg, color.text)}
              >
                {type} ×{count}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ====== Note Card Component (Swipeable) ======
function NoteCard({ note, show }: { note: Journal; show: Show }) {
  const date = new Date(note.journalDate);
  const month = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const typeColor = getCategoryColor(note.category);

  const polaroidRotations = [-3, 2, -1.5, 2.5, -2, 1, -2.5, 3];

  return (
    <div className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center">
      <div className={cn(
        "rounded-3xl border-2 flex flex-col overflow-y-auto scrollbar-hide max-h-[80vh]",
        typeColor.bg,
        typeColor.border
      )}>
        {note.photos && note.photos.length > 0 && (
          <div className="px-4 pt-4 space-y-3">
            {note.photos.length === 1 ? (
              <div className="bg-white p-2 pb-4 rounded-sm shadow-md">
                <img src={note.photos[0]} alt="" className="w-full h-auto object-contain rounded-sm" />
              </div>
            ) : (
              note.photos.map((photo, i) => (
                <div
                  key={i}
                  className="bg-white p-2 pb-4 rounded-sm shadow-md"
                  style={{
                    transform: `rotate(${polaroidRotations[i % polaroidRotations.length]}deg)`,
                    marginLeft: i % 2 === 0 ? '4px' : '12px',
                    marginRight: i % 2 === 0 ? '12px' : '4px',
                  }}
                >
                  <img src={photo} alt="" className="w-full h-auto object-contain rounded-sm" />
                </div>
              ))
            )}
          </div>
        )}

        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-macaron-cocoa">{month}</span>
              <div className="text-3xl font-display font-bold text-macaron-text-primary leading-none mt-0.5">{day}</div>
            </div>
            <div className="text-right">
              <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold bg-white/80", typeColor.text)}>
                {note.category || "Moment"}
              </span>
              <div className="text-xs text-macaron-cocoa mt-1">{weekday}</div>
            </div>
          </div>

          {note.content && (
            <div className="pt-2">
              <p className="text-sm text-macaron-text-primary leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2 border-t border-white/30">
            {note.mood && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/60 text-macaron-cocoa">
                <Smile size={10} className="inline mr-0.5" />{note.mood}
              </span>
            )}
            {note.weather && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/60 text-macaron-cocoa">
                <Cloud size={10} className="inline mr-0.5" />{note.weather}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ====== Show Detail Modal (Horizontal Swipe Notes) ======
function ShowDetailModal({ show, notes, onClose, onEditNote, onDeleteNote }: {
  show: Show;
  notes: Journal[];
  onClose: () => void;
  onEditNote: (note: Journal) => void;
  onDeleteNote: (id: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const showDate = new Date(show.showDate);
  const month = MONTH_NAMES[showDate.getMonth()];
  const day = showDate.getDate();

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.querySelector<HTMLDivElement>("[data-note-card]")?.offsetWidth || 300;
      const index = Math.round(scrollLeft / cardWidth);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  }, [currentIndex]);

  const scrollToCard = useCallback((index: number) => {
    if (scrollRef.current) {
      const cards = scrollRef.current.querySelectorAll<HTMLDivElement>("[data-note-card]");
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, []);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-macaron-vanilla border-2 border-macaron-rose-pale/50 max-w-md h-[90vh] p-0 gap-0 rounded-3xl overflow-hidden flex flex-col [&>button]:hidden">
        <div className="bg-white px-5 pt-6 pb-4 border-b border-macaron-rose-pale/30 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-macaron-shell transition-colors">
              <ChevronLeft size={20} className="text-macaron-cocoa" />
            </button>
            <span className="font-display font-bold text-macaron-text-primary">{notes.length} Notes</span>
            <div className="w-8" />
          </div>

          <h2 className="font-display text-xl font-bold text-macaron-text-primary mb-1">{show.title}</h2>
          {show.artist && (
            <p className="text-sm text-macaron-cocoa flex items-center gap-1 mb-2">
              <Heart size={12} className="text-macaron-rose" /> {show.artist}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-macaron-cocoa">
            <span className="flex items-center gap-1">
              <Calendar size={10} /> {month} {day}
            </span>
            {show.venue && (
              <span className="flex items-center gap-1">
                <MapPin size={10} /> {show.venue}
              </span>
            )}
          </div>
        </div>

        <div className="relative flex-1 min-h-0 py-4">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 h-full"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x pan-y",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {notes.map((note) => (
              <div key={note.id} data-note-card className="snap-center flex-shrink-0 flex items-start">
                <NoteCard note={note} show={show} />
              </div>
            ))}
          </div>

          {currentIndex > 0 && (
            <button
              onClick={() => scrollToCard(currentIndex - 1)}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-macaron-cocoa hover:bg-white transition-colors z-10"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {currentIndex < notes.length - 1 && (
            <button
              onClick={() => scrollToCard(currentIndex + 1)}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-macaron-cocoa hover:bg-white transition-colors z-10"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        <div className="bg-white px-5 pb-5 pt-3 flex-shrink-0 border-t border-macaron-rose-pale/30">
          <div className="flex justify-center gap-1.5 mb-4">
            {notes.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentIndex ? "bg-macaron-rose w-5" : "bg-macaron-rose-pale w-2"
                )}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onEditNote(notes[currentIndex])}
              className="flex-1 rounded-2xl border-macaron-rose-pale text-sm"
            >
              <Edit3 size={14} className="mr-1" /> Edit
            </Button>
            <Button
              variant="outline"
              onClick={() => onDeleteNote(notes[currentIndex].id)}
              className="flex-1 rounded-2xl border-macaron-rose-pale text-macaron-rose text-sm"
            >
              <Trash2 size={14} className="mr-1" /> Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ====== Note Editor Component ======
function NoteEditor({ note, onClose, onSubmit, shows }: {
  note?: Journal;
  onClose: () => void;
  onSubmit: (data: CreateJournal) => void;
  shows: Show[];
}) {
  const [showId, setShowId] = useState<number>(note?.showId || shows[0]?.id || 0);
  const [journalDate, setJournalDate] = useState(note?.journalDate || new Date().toISOString().split("T")[0]);
  const [content, setContent] = useState(note?.content || "");
  const [mood, setMood] = useState(note?.mood || "");
  const [weather, setWeather] = useState(note?.weather || "");
  const [category, setCategory] = useState<string>(note?.category || "Moment");
  const [photos, setPhotos] = useState<string[]>(note?.photos || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CATEGORY_PAPER_MAP: Record<string, string> = {
    Plan: "mint",
    Moment: "vanilla",
    Memory: "lemon",
  };
  const paperStyle = CATEGORY_PAPER_MAP[category] || "vanilla";

  const selectedShow = shows.find(s => s.id === showId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!showId || !journalDate) return;
    const data: CreateJournal = {
      showId,
      journalDate,
      content: content || undefined,
      mood: mood || undefined,
      weather: weather || undefined,
      coverImage: photos[0] || undefined,
      photos: photos.length > 0 ? photos : undefined,
      category: category || undefined,
      paperStyle: paperStyle || undefined,
    };
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white border-2 border-macaron-rose-pale/50 max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl p-0 gap-0 [&>button]:hidden">
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-macaron-rose-pale/30">
          <div className="flex items-center justify-between">
            <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-macaron-shell transition-colors">
              <ChevronLeft size={20} className="text-macaron-cocoa" />
            </button>
            <span className="font-display font-bold text-macaron-text-primary">
              {note ? "Edit Note" : "New Note"}
            </span>
            <button
              onClick={handleSave}
              disabled={!showId || !journalDate}
              className="px-3 py-1.5 bg-macaron-rose text-white text-sm font-semibold rounded-full disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-macaron-rose" />
            <Input
              type="date"
              value={journalDate}
              onChange={(e) => setJournalDate(e.target.value)}
              className="flex-1 bg-macaron-vanilla border-macaron-rose-pale rounded-2xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-macaron-cocoa font-medium mb-2 block flex items-center gap-1">
              <Music size={12} /> Show
            </label>
            <select
              value={showId}
              onChange={(e) => setShowId(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-macaron-vanilla border border-macaron-rose-pale rounded-2xl text-sm text-macaron-text-primary outline-none focus:border-macaron-rose"
            >
              {shows.map((show) => (
                <option key={show.id} value={show.id}>
                  {show.title} {show.artist ? `- ${show.artist}` : ""}
                </option>
              ))}
            </select>
            {selectedShow && (
              <p className="text-xs text-macaron-cocoa mt-1.5">
                {selectedShow.showDate} · {selectedShow.venue || "TBA"}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-macaron-cocoa font-medium mb-2 block">Note Type</label>
            <div className="flex gap-2">
              {NOTE_CATEGORIES.map((cat) => {
                const color = getCategoryColor(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex-1 py-2 rounded-2xl text-xs font-bold transition-colors border-2",
                      category === cat
                        ? cn(color.bg, color.text, color.border)
                        : "bg-white text-macaron-cocoa border-macaron-milk-tea hover:border-macaron-rose-pale"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs text-macaron-cocoa font-medium mb-2 block">Your Note</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write about this moment..."
              className="bg-macaron-vanilla border-macaron-rose-pale rounded-2xl min-h-[120px] text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-macaron-cocoa font-medium mb-2 block flex items-center gap-1">
              <ImageIcon size={12} /> Photos ({photos.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-macaron-rose-pale/30">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-macaron-rose text-white flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-macaron-rose-pale flex items-center justify-center text-macaron-rose hover:bg-macaron-rose-pale/20 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-macaron-cocoa font-medium mb-2 block flex items-center gap-1">
                <Smile size={12} /> Mood
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full px-3 py-2 bg-macaron-vanilla border border-macaron-rose-pale rounded-2xl text-sm text-macaron-text-primary outline-none focus:border-macaron-rose"
              >
                <option value="">Select...</option>
                {MOODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-macaron-cocoa font-medium mb-2 block flex items-center gap-1">
                <Cloud size={12} /> Weather
              </label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full px-3 py-2 bg-macaron-vanilla border border-macaron-rose-pale rounded-2xl text-sm text-macaron-text-primary outline-none focus:border-macaron-rose"
              >
                <option value="">Select...</option>
                {WEATHERS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ====== Main Journal Page ======
export function JournalPage() {
  const { data: journals = [], isLoading: isLoadingJournals } = useJournals();
  const { data: shows = [], isLoading: isLoadingShows } = useShows();
  const createJournal = useCreateJournal();
  const updateJournal = useUpdateJournal();
  const deleteJournal = useDeleteJournal();

  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [editingNote, setEditingNote] = useState<Journal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const journalsByShow = useMemo(() => {
    const grouped = new Map<number, Journal[]>();
    journals.forEach((journal) => {
      if (journal.showId == null) return;
      const list = grouped.get(journal.showId) || [];
      list.push(journal);
      grouped.set(journal.showId, list);
    });
    grouped.forEach((list) => list.sort((a, b) => new Date(b.journalDate).getTime() - new Date(a.journalDate).getTime()));
    return grouped;
  }, [journals]);

  const showsWithJournals = useMemo(() => {
    return shows
      .filter((show) => journalsByShow.has(show.id))
      .sort((a, b) => new Date(b.showDate).getTime() - new Date(a.showDate).getTime());
  }, [shows, journalsByShow]);

  const handleCreate = (data: CreateJournal) => {
    createJournal.mutate(data);
  };

  const handleUpdate = (data: CreateJournal) => {
    if (editingNote) {
      updateJournal.mutate({ id: editingNote.id, data });
      setEditingNote(null);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      deleteJournal.mutate(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const isLoading = isLoadingJournals || isLoadingShows;

  return (
    <div className="min-h-screen pb-24 bg-macaron-vanilla overflow-x-hidden">
      <header className="px-6 pt-10 pb-3">
        <h1 className="font-display text-2xl font-bold text-macaron-text-primary">Journal</h1>
        <p className="text-sm text-macaron-cocoa mt-1 font-medium">Capture moments from your shows</p>
      </header>

      <div className="px-6 space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-macaron-cocoa">Loading...</div>
        ) : showsWithJournals.length > 0 ? (
          showsWithJournals.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              notes={journalsByShow.get(show.id) || []}
              onClick={() => setSelectedShow(show)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Music size={36} className="mx-auto text-macaron-rose-pale mb-3" />
            <p className="text-sm text-macaron-cocoa font-medium">No journal entries yet</p>
            <p className="text-xs text-macaron-cocoa mt-1">Add a show first, then create notes</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-macaron-rose text-white shadow-macaron-pink flex items-center justify-center hover:bg-macaron-rose-soft transition-colors z-40"
      >
        <Plus size={24} />
      </button>

      {selectedShow && (
        <ShowDetailModal
          show={selectedShow}
          notes={journalsByShow.get(selectedShow.id) || []}
          onClose={() => setSelectedShow(null)}
          onEditNote={(note) => {
            setEditingNote(note);
          }}
          onDeleteNote={handleDelete}
        />
      )}

      {(showForm || editingNote) && (
        <NoteEditor
          note={editingNote || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingNote(null);
          }}
          onSubmit={editingNote ? handleUpdate : handleCreate}
          shows={shows}
        />
      )}

      {deleteConfirmId !== null && (
        <Dialog open onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent className="bg-white border-2 border-macaron-rose-pale/50 max-w-sm rounded-3xl">
            <DialogHeader>
              <DialogTitle className="font-display text-lg font-bold text-macaron-text-primary">Delete Note?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-macaron-cocoa text-center py-4">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-2xl border-macaron-rose-pale">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="flex-1 rounded-2xl bg-macaron-rose hover:bg-macaron-rose-soft text-white font-bold">
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
