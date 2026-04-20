import type { Context } from "hono";
import { getPhotoRepository } from "../models/repositories/photo.repository";
import type { CreatePhoto } from "../../shared/schema";

export async function listPhotos(c: Context) {
  try {
    const repo = await getPhotoRepository();
    const showId = c.req.query("showId");
    const journalId = c.req.query("journalId");
    const query = repo.createQueryBuilder("photo");

    if (showId) {
      query.where("photo.showId = :showId", { showId: Number(showId) });
    }
    if (journalId) {
      query.where("photo.journalId = :journalId", { journalId: Number(journalId) });
    }

    const photos = await query.orderBy("photo.createdAt", "DESC").getMany();
    return c.json(photos);
  } catch (error) {
    console.error("GET /api/photos failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function createPhoto(c: Context) {
  try {
    const repo = await getPhotoRepository();
    const body = await c.req.json<CreatePhoto>();
    const photo = repo.create(body);
    const result = await repo.save(photo);
    return c.json(result, 201);
  } catch (error) {
    console.error("POST /api/photos failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}

export async function deletePhoto(c: Context) {
  try {
    const repo = await getPhotoRepository();
    const id = Number(c.req.param("id"));
    await repo.delete(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/photos/:id failed:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
}
