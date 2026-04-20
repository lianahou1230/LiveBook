import { z } from "zod";

export const ShowSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  artist: z.string().optional(),
  venue: z.string().optional(),
  city: z.string().optional(),
  showDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  showTime: z.string().optional(),
  genre: z.string().optional(),
  posterUrl: z.string().optional(),
  rating: z.number().min(1).max(10).optional(),
  ticketPrice: z.string().optional(),
  seatInfo: z.string().optional(),
  isUpcoming: z.boolean().default(false),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreateShowSchema = ShowSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const UpdateShowSchema = CreateShowSchema.partial();

export type Show = z.infer<typeof ShowSchema>;
export type CreateShow = z.infer<typeof CreateShowSchema>;
export type UpdateShow = z.infer<typeof UpdateShowSchema>;

export const JournalSchema = z.object({
  id: z.number(),
  showId: z.number().optional(),
  content: z.string().optional(),
  journalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mood: z.string().optional(),
  weather: z.string().optional(),
  coverImage: z.string().optional(),
  photos: z.array(z.string()).optional(),
  category: z.string().optional(),
  paperStyle: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const CreateJournalSchema = JournalSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const UpdateJournalSchema = CreateJournalSchema.partial();

export type Journal = z.infer<typeof JournalSchema>;
export type CreateJournal = z.infer<typeof CreateJournalSchema>;
export type UpdateJournal = z.infer<typeof UpdateJournalSchema>;

export const PhotoSchema = z.object({
  id: z.number(),
  showId: z.number().optional(),
  journalId: z.number().optional(),
  url: z.string(),
  caption: z.string().optional(),
  tag: z.string().optional(),
  createdAt: z.string().optional(),
});

export const CreatePhotoSchema = PhotoSchema.omit({ id: true, createdAt: true });
export type Photo = z.infer<typeof PhotoSchema>;
export type CreatePhoto = z.infer<typeof CreatePhotoSchema>;

export const StatsSchema = z.object({
  totalShows: z.number(),
  totalArtists: z.number(),
  totalVenues: z.number(),
  totalCities: z.number(),
  thisMonthShows: z.number(),
  thisYearShows: z.number(),
  upcomingShows: z.number(),
  averageRating: z.number().optional(),
  genreDistribution: z.record(z.string(), z.number()),
  monthlyDistribution: z.record(z.string(), z.number()),
  artistFrequency: z.record(z.string(), z.number()),
});

export type Stats = z.infer<typeof StatsSchema>;

export const CountdownItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  artist: z.string().optional(),
  venue: z.string().optional(),
  showDate: z.string(),
  showTime: z.string().optional(),
  daysLeft: z.number(),
});

export type CountdownItem = z.infer<typeof CountdownItemSchema>;

export const CalendarDaySchema = z.object({
  date: z.string(),
  hasShow: z.boolean(),
  shows: z.array(z.object({
    id: z.number(),
    title: z.string(),
    artist: z.string().optional(),
    isUpcoming: z.boolean(),
  })),
});

export type CalendarDay = z.infer<typeof CalendarDaySchema>;
