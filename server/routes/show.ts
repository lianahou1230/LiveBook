import { Hono } from "hono";
import {
  listShows,
  getShow,
  createShow,
  updateShow,
  deleteShow,
} from "../controllers/show.controller";

const showRoute = new Hono();

showRoute.get("/", listShows);
showRoute.get("/:id", getShow);
showRoute.post("/", createShow);
showRoute.patch("/:id", updateShow);
showRoute.delete("/:id", deleteShow);

export { showRoute };
