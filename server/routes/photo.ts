import { Hono } from "hono";
import {
  listPhotos,
  createPhoto,
  deletePhoto,
} from "../controllers/photo.controller";

const photoRoute = new Hono();

photoRoute.get("/", listPhotos);
photoRoute.post("/", createPhoto);
photoRoute.delete("/:id", deletePhoto);

export { photoRoute };
