import { useState, useRef, useEffect } from "react";
import { Plus, Search, Music, MapPin, Calendar, Star, Trash2, Edit3, Camera, ImageIcon, X } from "lucide-react";
import { useShows, useCreateShow, useUpdateShow, useDeleteShow } from "@/hooks/use-api";
import { useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Show, CreateShow } from "@shared/schema";

function PhotoUploader({ photos, onChange }: { photos: string[]; onChange: (photos: string[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onChange([...photos, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-macaron-cocoa font-medium block">Photos</label>
      <div className="flex flex-wrap gap-2">
        {photos.map((photo, index) => (
          <div key={index} className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-macaron-rose-pale/50">
            <img src={photo} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-macaron-rose text-white flex items-center justify-center"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 rounded-2xl border-2 border-dashed border-macaron-rose-pale flex flex-col items-center justify-center gap-1 text-macaron-rose hover:bg-macaron-rose-pale/30 transition-colors"
        >
          <Camera size={18} />
          <span className="text-[10px] font-medium">Add</span>
        </button>
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
    </div>
  );
}

function ShowDetail({ show, onClose, onEdit, onDelete }: {
  show: Show;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white border-2 border-macaron-rose-pale/50 max-w-md max-h-[85vh] overflow-y-auto scrollbar-hide rounded-3xl p-6 gap-0 [&>button]:hidden">
        <div className="flex items-center justify-between mb-3">
          <DialogTitle className="font-display text-xl font-bold text-macaron-text-primary">{show.title}</DialogTitle>
        </div>
        <div className="space-y-3">
          {show.artist && (
            <p className="flex items-center gap-2 text-macaron-text-primary">
              <Music size={16} className="text-macaron-rose" /> {show.artist}
            </p>
          )}
          <p className="flex items-center gap-2 text-macaron-cocoa">
            <Calendar size={16} /> {show.showDate} {show.showTime && `· ${show.showTime}`}
          </p>
          {show.venue && (
            <p className="flex items-center gap-2 text-macaron-cocoa">
              <MapPin size={16} /> {show.venue} {show.city && `· ${show.city}`}
            </p>
          )}
          {show.genre && (
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-macaron-rose-pale text-macaron-rose font-semibold">
              {show.genre}
            </span>
          )}
          {show.rating && (
            <div className="flex items-center gap-1 text-macaron-peach">
              <Star size={16} fill="currentColor" />
              <span className="font-bold">{show.rating} / 10</span>
            </div>
          )}
          {show.ticketPrice && (
            <p className="text-sm text-macaron-cocoa">Ticket: {show.ticketPrice}</p>
          )}
          {show.seatInfo && (
            <p className="text-sm text-macaron-cocoa">Seat: {show.seatInfo}</p>
          )}
          {show.notes && (
            <div className="bg-macaron-shell rounded-2xl p-4 mt-2">
              <p className="text-sm text-macaron-text-primary whitespace-pre-wrap">{show.notes}</p>
            </div>
          )}
          {show.posterUrl && (
            <div className="rounded-2xl overflow-hidden border-2 border-macaron-rose-pale/50 max-w-[200px] mx-auto">
              <img src={show.posterUrl} alt="" className="w-full aspect-[2/3] object-cover" />
            </div>
          )}
          <div className="flex gap-2 pt-3">
            <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 rounded-2xl border-macaron-rose-pale">
              <Edit3 size={14} className="mr-1" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="flex-1 rounded-2xl border-macaron-rose-pale text-macaron-rose">
              <Trash2 size={14} className="mr-1" /> Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShowForm({ show, onClose, onSubmit }: {
  show?: Show;
  onClose: () => void;
  onSubmit: (data: CreateShow) => void;
}) {
  const [form, setForm] = useState<Partial<CreateShow>>({
    title: show?.title || "",
    artist: show?.artist || "",
    venue: show?.venue || "",
    city: show?.city || "",
    showDate: show?.showDate || new Date().toISOString().split("T")[0],
    showTime: show?.showTime || "",
    genre: show?.genre || "",
    rating: show?.rating,
    ticketPrice: show?.ticketPrice || "",
    seatInfo: show?.seatInfo || "",
    isUpcoming: show?.isUpcoming ?? false,
    notes: show?.notes || "",
    posterUrl: show?.posterUrl || "",
  });
  const [photos, setPhotos] = useState<string[]>(show?.posterUrl ? [show.posterUrl] : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.showDate) return;
    const data: Record<string, unknown> = {
      title: form.title,
      artist: form.artist || undefined,
      venue: form.venue || undefined,
      city: form.city || undefined,
      showDate: form.showDate,
      showTime: form.showTime || undefined,
      genre: form.genre || undefined,
      rating: form.rating,
      ticketPrice: form.ticketPrice || undefined,
      seatInfo: form.seatInfo || undefined,
      isUpcoming: form.isUpcoming,
      notes: form.notes || undefined,
      posterUrl: photos[0] || null,
    };
    onSubmit(data as CreateShow);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white border-2 border-macaron-rose-pale/50 max-w-md max-h-[85vh] overflow-y-auto scrollbar-hide rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold text-macaron-text-primary">
            {show ? "Edit Show" : "Add Show"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          {/* Photos */}
          <div>
            <label className="text-sm text-macaron-cocoa font-medium block mb-2">Photos</label>
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-macaron-rose-pale/50">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(index);
                    }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-macaron-rose text-white flex items-center justify-center z-10"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-macaron-rose-pale flex flex-col items-center justify-center gap-1 text-macaron-rose hover:bg-macaron-rose-pale/30 transition-colors"
              >
                <Camera size={18} />
                <span className="text-[10px] font-medium">Add</span>
              </button>
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
          </div>

          <div>
            <label className="text-sm text-macaron-cocoa font-medium mb-1 block">Show Name *</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Jay Chou Carnival Tour"
              className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl"
              required
            />
          </div>
          <div>
            <label className="text-sm text-macaron-cocoa font-medium mb-1 block">Artist / Band</label>
            <Input
              value={form.artist}
              onChange={(e) => setForm({ ...form, artist: e.target.value })}
              placeholder="Artist or band name"
              className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-macaron-cocoa font-medium mb-1 block">Date *</label>
              <Input
                type="date"
                value={form.showDate}
                onChange={(e) => setForm({ ...form, showDate: e.target.value })}
                className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl"
                required
              />
            </div>
            <div>
              <label className="text-sm text-macaron-cocoa font-medium mb-1 block">Time</label>
              <Input
                type="time"
                value={form.showTime}
                onChange={(e) => setForm({ ...form, showTime: e.target.value })}
                className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-macaron-cocoa font-medium mb-1 block">Venue</label>
              <Input
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                placeholder="Venue name"
                className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl"
              />
            </div>
            <div>
              <label className="text-sm text-macaron-cocoa font-medium mb-1 block">City</label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City"
                className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-macaron-cocoa font-medium mb-1 block">Genre</label>
              <Input
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                placeholder="Pop / Rock / Jazz..."
                className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl"
              />
            </div>
            <div>
              <label className="text-sm text-macaron-cocoa font-medium mb-1 block">Rating (1-10)</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={form.rating || ""}
                onChange={(e) => setForm({ ...form, rating: e.target.value ? Number(e.target.value) : undefined })}
                className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-macaron-cocoa font-medium mb-1 block">Ticket Price</label>
              <Input
                value={form.ticketPrice}
                onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })}
                placeholder="e.g. $80"
                className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl"
              />
            </div>
            <div>
              <label className="text-sm text-macaron-cocoa font-medium mb-1 block">Seat</label>
              <Input
                value={form.seatInfo}
                onChange={(e) => setForm({ ...form, seatInfo: e.target.value })}
                placeholder="e.g. Section A, Row 3"
                className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-macaron-cocoa font-medium mb-1 block">Notes</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Write your thoughts about the show..."
              className="bg-macaron-vanilla border-macaron-milk-tea rounded-2xl min-h-[80px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isUpcoming"
              checked={form.isUpcoming}
              onChange={(e) => setForm({ ...form, isUpcoming: e.target.checked })}
              className="rounded border-macaron-milk-tea w-4 h-4 accent-macaron-rose"
            />
            <label htmlFor="isUpcoming" className="text-sm text-macaron-cocoa font-medium">This is an upcoming show</label>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl border-macaron-rose-pale">Cancel</Button>
            <Button type="submit" className="flex-1 rounded-2xl bg-macaron-rose hover:bg-macaron-rose-soft text-white font-bold">
              {show ? "Save" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ShowsPage() {
  const { data: shows = [], isLoading } = useShows();
  const createShow = useCreateShow();
  const updateShow = useUpdateShow();
  const deleteShow = useDeleteShow();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [search, setSearch] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const idParam = searchParams.get("id");
    const actionParam = searchParams.get("action");
    const filterParam = searchParams.get("filter");
    if (idParam && shows.length > 0 && !selectedShow) {
      const show = shows.find((s) => s.id === Number(idParam));
      if (show) {
        setSelectedShow(show);
        setSearchParams({}, { replace: true });
      }
    }
    if (actionParam === "add" && !showForm) {
      setShowForm(true);
      setSearchParams({}, { replace: true });
    }
    if (filterParam && ["all", "upcoming", "past"].includes(filterParam)) {
      setFilter(filterParam as "all" | "upcoming" | "past");
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, shows, selectedShow, showForm, setSearchParams]);

  const filteredShows = shows.filter((s) => {
    if (filter === "upcoming") return s.isUpcoming;
    if (filter === "past") return !s.isUpcoming;
    return true;
  }).filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.title.toLowerCase().includes(q) || (s.artist?.toLowerCase().includes(q) ?? false);
  }).sort((a, b) => new Date(b.showDate).getTime() - new Date(a.showDate).getTime());

  const handleCreate = (data: CreateShow) => {
    createShow.mutate(data);
  };

  const handleUpdate = (data: CreateShow) => {
    if (editingShow) {
      updateShow.mutate({ id: editingShow.id, data });
      setEditingShow(null);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId !== null) {
      deleteShow.mutate(deleteConfirmId);
      setDeleteConfirmId(null);
      setSelectedShow(null);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-macaron-vanilla overflow-x-hidden">
      <header className="px-6 pt-10 pb-3">
        <h1 className="font-display text-2xl font-bold text-macaron-text-primary mb-3">My Shows</h1>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-macaron-cocoa" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shows or artists..."
            className="pl-10 bg-white border-macaron-milk-tea rounded-2xl"
          />
        </div>
      </header>

      <div className="px-6 flex gap-2 mb-4">
        {(["all", "upcoming", "past"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all",
              filter === f
                ? "bg-macaron-rose text-white shadow-macaron-pink"
                : "bg-white text-macaron-cocoa hover:text-macaron-text-primary border border-macaron-rose-pale/50"
            )}
          >
            {f === "all" ? "All" : f === "upcoming" ? "Upcoming" : "Past"}
          </button>
        ))}
      </div>

      <div className="px-6 space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-macaron-cocoa">Loading...</div>
        ) : filteredShows.length > 0 ? (
          filteredShows.map((show) => (
            <div
              key={show.id}
              onClick={() => setSelectedShow(show)}
              className="bg-white rounded-3xl p-5 shadow-macaron-sm border-2 border-macaron-rose-pale/30 cursor-pointer transition-all duration-200 hover:shadow-macaron-lg hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-macaron-text-primary text-base line-clamp-1">{show.title}</h3>
                  {show.artist && (
                    <p className="text-sm text-macaron-cocoa mt-0.5">{show.artist}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-macaron-cocoa">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {show.showDate}
                    </span>
                    {show.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {show.venue}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {show.isUpcoming && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-macaron-mint-light text-macaron-mint font-bold">Upcoming</span>
                  )}
                  {show.rating && (
                    <div className="flex items-center gap-0.5 text-macaron-peach">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold">{show.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              {show.posterUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border-2 border-macaron-rose-pale/30">
                  <img src={show.posterUrl} alt="" className="w-full aspect-[2/3] object-cover" />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Music size={36} className="mx-auto text-macaron-rose-pale mb-3" />
            <p className="text-sm text-macaron-cocoa font-medium">No shows yet</p>
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
        <ShowDetail
          show={selectedShow}
          onClose={() => setSelectedShow(null)}
          onEdit={() => {
            setEditingShow(selectedShow);
            setSelectedShow(null);
          }}
          onDelete={() => handleDelete(selectedShow.id)}
        />
      )}

      {showForm && (
        <ShowForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingShow && (
        <ShowForm
          show={editingShow}
          onClose={() => setEditingShow(null)}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId !== null && (
        <Dialog open onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent className="bg-white border-2 border-macaron-rose-pale/50 max-w-sm rounded-3xl">
            <DialogHeader>
              <DialogTitle className="font-display text-lg font-bold text-macaron-text-primary">Delete Show?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-macaron-cocoa mt-2">This action cannot be undone.</p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-2xl border-macaron-rose-pale">Cancel</Button>
              <Button onClick={confirmDelete} className="flex-1 rounded-2xl bg-macaron-rose hover:bg-macaron-rose-soft text-white font-bold">Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
