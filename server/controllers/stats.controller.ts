import { Like } from "typeorm";
import type { Context } from "hono";
import { getShowRepository } from "../models/repositories/show.repository";
import type { Stats, CountdownItem, CalendarDay } from "../../shared/schema";
import type { ShowEntity } from "../models/entities/show.entity";

export async function getStats(c: Context) {
  try {
    const repo = await getShowRepository();
    const shows: ShowEntity[] = await repo.find();
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const currentYear = String(now.getFullYear());

    const artists = new Set(shows.map((s: ShowEntity) => s.artist).filter(Boolean));
    const venues = new Set(shows.map((s: ShowEntity) => s.venue).filter(Boolean));
    const cities = new Set(shows.map((s: ShowEntity) => s.city).filter(Boolean));

    const thisMonthShows = shows.filter((s: ShowEntity) => s.showDate.startsWith(currentMonth)).length;
    const thisYearShows = shows.filter((s: ShowEntity) => s.showDate.startsWith(currentYear)).length;
    const upcomingShows = shows.filter((s: ShowEntity) => s.isUpcoming).length;

    const ratedShows = shows.filter((s: ShowEntity) => s.rating);
    const averageRating = ratedShows.length > 0
      ? Math.round((ratedShows.reduce((sum: number, s: ShowEntity) => sum + (s.rating || 0), 0) / ratedShows.length) * 10) / 10
      : undefined;

    const genreDistribution: Record<string, number> = {};
    shows.forEach((s: ShowEntity) => {
      if (s.genre) {
        genreDistribution[s.genre] = (genreDistribution[s.genre] || 0) + 1;
      }
    });

    const monthlyDistribution: Record<string, number> = {};
    shows.forEach((s: ShowEntity) => {
      const month = s.showDate.slice(0, 7);
      monthlyDistribution[month] = (monthlyDistribution[month] || 0) + 1;
    });

    const artistFrequency: Record<string, number> = {};
    shows.forEach((s: ShowEntity) => {
      if (s.artist) {
        artistFrequency[s.artist] = (artistFrequency[s.artist] || 0) + 1;
      }
    });

    const stats: Stats = {
      totalShows: shows.length,
      totalArtists: artists.size,
      totalVenues: venues.size,
      totalCities: cities.size,
      thisMonthShows,
      thisYearShows,
      upcomingShows,
      averageRating,
      genreDistribution,
      monthlyDistribution,
      artistFrequency,
    };

    return c.json(stats);
  } catch (error) {
    console.error("GET /api/stats failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function getCountdown(c: Context) {
  try {
    const repo = await getShowRepository();
    const upcomingShows: ShowEntity[] = await repo.find({
      where: { isUpcoming: true },
      order: { showDate: "ASC" },
    });

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const countdown: CountdownItem[] = upcomingShows.map((show: ShowEntity) => {
      const showDate = new Date(show.showDate);
      showDate.setHours(0, 0, 0, 0);
      const diffTime = showDate.getTime() - now.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        id: show.id,
        title: show.title,
        artist: show.artist,
        venue: show.venue,
        showDate: show.showDate,
        showTime: show.showTime,
        daysLeft,
      };
    });

    return c.json(countdown);
  } catch (error) {
    console.error("GET /api/countdown failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function getCalendar(c: Context) {
  try {
    const repo = await getShowRepository();
    const year = c.req.query("year") || String(new Date().getFullYear());
    const month = c.req.query("month") || String(new Date().getMonth() + 1);
    const monthStr = `${year}-${month.padStart(2, "0")}`;

    const shows: ShowEntity[] = await repo.find({
      where: [{ showDate: Like(`${monthStr}%`) }],
    });

    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
    const calendarDays: CalendarDay[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${monthStr}-${String(day).padStart(2, "0")}`;
      const dayShows = shows.filter((s: ShowEntity) => s.showDate === dateStr);

      calendarDays.push({
        date: dateStr,
        hasShow: dayShows.length > 0,
        shows: dayShows.map((s: ShowEntity) => ({
          id: s.id,
          title: s.title,
          artist: s.artist,
          isUpcoming: s.isUpcoming,
        })),
      });
    }

    return c.json(calendarDays);
  } catch (error) {
    console.error("GET /api/calendar failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}
