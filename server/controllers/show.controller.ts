import type { Context } from "hono";
import { getShowRepository } from "../models/repositories/show.repository";
import type { CreateShow, UpdateShow } from "../../shared/schema";

export async function listShows(c: Context) {
  try {
    const repo = await getShowRepository();
    const upcoming = c.req.query("upcoming");
    const artist = c.req.query("artist");
    const query = repo.createQueryBuilder("show");

    if (upcoming === "true") {
      query.where("show.isUpcoming = :isUpcoming", { isUpcoming: true });
    } else if (upcoming === "false") {
      query.where("show.isUpcoming = :isUpcoming", { isUpcoming: false });
    }

    if (artist) {
      query.andWhere("show.artist LIKE :artist", { artist: `%${artist}%` });
    }

    const shows = await query.orderBy("show.showDate", "DESC").getMany();
    return c.json(shows);
  } catch (error) {
    console.error("GET /api/shows failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function getShow(c: Context) {
  try {
    const repo = await getShowRepository();
    const id = Number(c.req.param("id"));
    const show = await repo.findOne({ where: { id } });
    if (!show) return c.json({ message: "Not found" }, 404);
    return c.json(show);
  } catch (error) {
    console.error("GET /api/shows/:id failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function createShow(c: Context) {
  try {
    const repo = await getShowRepository();
    const body = await c.req.json<CreateShow>();
    const show = repo.create(body);
    const result = await repo.save(show);
    return c.json(result, 201);
  } catch (error) {
    console.error("POST /api/shows failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function updateShow(c: Context) {
  try {
    const repo = await getShowRepository();
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const show = await repo.findOne({ where: { id } });
    if (!show) return c.json({ message: "Not found" }, 404);
    
    if (body.title !== undefined) show.title = body.title;
    if (body.artist !== undefined) show.artist = body.artist || null;
    if (body.venue !== undefined) show.venue = body.venue || null;
    if (body.city !== undefined) show.city = body.city || null;
    if (body.showDate !== undefined) show.showDate = body.showDate;
    if (body.showTime !== undefined) show.showTime = body.showTime || null;
    if (body.genre !== undefined) show.genre = body.genre || null;
    if (body.posterUrl !== undefined) show.posterUrl = body.posterUrl || null;
    if (body.rating !== undefined) show.rating = body.rating ?? null;
    if (body.ticketPrice !== undefined) show.ticketPrice = body.ticketPrice || null;
    if (body.seatInfo !== undefined) show.seatInfo = body.seatInfo || null;
    if (body.isUpcoming !== undefined) show.isUpcoming = body.isUpcoming;
    if (body.notes !== undefined) show.notes = body.notes || null;
    
    const result = await repo.save(show);
    return c.json(result);
  } catch (error) {
    console.error("PATCH /api/shows/:id failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function deleteShow(c: Context) {
  try {
    const repo = await getShowRepository();
    const id = Number(c.req.param("id"));
    await repo.delete(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/shows/:id failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}
