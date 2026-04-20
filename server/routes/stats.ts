import { Hono } from "hono";
import {
  getStats,
  getCountdown,
  getCalendar,
} from "../controllers/stats.controller";

const statsRoute = new Hono();

statsRoute.get("/", getStats);
statsRoute.get("/countdown", getCountdown);
statsRoute.get("/calendar", getCalendar);

export { statsRoute };
