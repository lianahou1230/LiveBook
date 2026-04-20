import { Hono } from "hono";
import {
  listJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
} from "../controllers/journal.controller";

const journalRoute = new Hono();

journalRoute.get("/", listJournals);
journalRoute.get("/:id", getJournal);
journalRoute.post("/", createJournal);
journalRoute.patch("/:id", updateJournal);
journalRoute.delete("/:id", deleteJournal);

export { journalRoute };
