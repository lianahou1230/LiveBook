import type { Context } from "hono";
import { getJournalRepository } from "../models/repositories/journal.repository";
import type { CreateJournal, UpdateJournal } from "../../shared/schema";

export async function listJournals(c: Context) {
  try {
    const repo = await getJournalRepository();
    const showId = c.req.query("showId");
    const query = repo.createQueryBuilder("journal");

    if (showId) {
      query.where("journal.showId = :showId", { showId: Number(showId) });
    }

    const journals = await query.orderBy("journal.journalDate", "DESC").getMany();
    return c.json(journals);
  } catch (error) {
    console.error("GET /api/journals failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function getJournal(c: Context) {
  try {
    const repo = await getJournalRepository();
    const id = Number(c.req.param("id"));
    const journal = await repo.findOne({ where: { id } });
    if (!journal) return c.json({ message: "Not found" }, 404);
    return c.json(journal);
  } catch (error) {
    console.error("GET /api/journals/:id failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function createJournal(c: Context) {
  try {
    const repo = await getJournalRepository();
    const body = await c.req.json<CreateJournal>();
    const journal = repo.create(body);
    const result = await repo.save(journal);
    return c.json(result, 201);
  } catch (error) {
    console.error("POST /api/journals failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function updateJournal(c: Context) {
  try {
    const repo = await getJournalRepository();
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const journal = await repo.findOne({ where: { id } });
    if (!journal) return c.json({ message: "Not found" }, 404);
    
    if (body.showId !== undefined) journal.showId = body.showId ?? null;
    if (body.content !== undefined) journal.content = body.content || null;
    if (body.journalDate !== undefined) journal.journalDate = body.journalDate;
    if (body.mood !== undefined) journal.mood = body.mood || null;
    if (body.weather !== undefined) journal.weather = body.weather || null;
    if (body.coverImage !== undefined) journal.coverImage = body.coverImage || null;
    if (body.photos !== undefined) journal.photos = Array.isArray(body.photos) && body.photos.length > 0 ? body.photos : null;
    if (body.category !== undefined) journal.category = body.category || null;
    if (body.paperStyle !== undefined) journal.paperStyle = body.paperStyle || null;
    
    const result = await repo.save(journal);
    return c.json(result);
  } catch (error) {
    console.error("PATCH /api/journals/:id failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function deleteJournal(c: Context) {
  try {
    const repo = await getJournalRepository();
    const id = Number(c.req.param("id"));
    await repo.delete(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/journals/:id failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}
