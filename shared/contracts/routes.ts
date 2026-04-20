import { z } from "zod";
import {
  ShowSchema,
  CreateShowSchema,
  UpdateShowSchema,
  JournalSchema,
  CreateJournalSchema,
  UpdateJournalSchema,
  PhotoSchema,
  CreatePhotoSchema,
  StatsSchema,
  CountdownItemSchema,
  CalendarDaySchema,
} from "../schema";

export const api = {
  shows: {
    list: {
      method: "GET",
      path: "/api/shows",
      query: z.object({ upcoming: z.string().optional(), artist: z.string().optional() }).optional(),
      responses: {
        200: z.array(ShowSchema),
      },
    },
    get: {
      method: "GET",
      path: "/api/shows/:id",
      responses: {
        200: ShowSchema,
      },
    },
    create: {
      method: "POST",
      path: "/api/shows",
      body: CreateShowSchema,
      responses: {
        201: ShowSchema,
      },
    },
    update: {
      method: "PATCH",
      path: "/api/shows/:id",
      body: UpdateShowSchema,
      responses: {
        200: ShowSchema,
      },
    },
    delete: {
      method: "DELETE",
      path: "/api/shows/:id",
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
  journals: {
    list: {
      method: "GET",
      path: "/api/journals",
      query: z.object({ showId: z.string().optional() }).optional(),
      responses: {
        200: z.array(JournalSchema),
      },
    },
    get: {
      method: "GET",
      path: "/api/journals/:id",
      responses: {
        200: JournalSchema,
      },
    },
    create: {
      method: "POST",
      path: "/api/journals",
      body: CreateJournalSchema,
      responses: {
        201: JournalSchema,
      },
    },
    update: {
      method: "PATCH",
      path: "/api/journals/:id",
      body: UpdateJournalSchema,
      responses: {
        200: JournalSchema,
      },
    },
    delete: {
      method: "DELETE",
      path: "/api/journals/:id",
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
  photos: {
    list: {
      method: "GET",
      path: "/api/photos",
      query: z.object({ showId: z.string().optional(), journalId: z.string().optional() }).optional(),
      responses: {
        200: z.array(PhotoSchema),
      },
    },
    create: {
      method: "POST",
      path: "/api/photos",
      body: CreatePhotoSchema,
      responses: {
        201: PhotoSchema,
      },
    },
    delete: {
      method: "DELETE",
      path: "/api/photos/:id",
      responses: {
        200: z.object({ success: z.boolean() }),
      },
    },
  },
  stats: {
    get: {
      method: "GET",
      path: "/api/stats",
      responses: {
        200: StatsSchema,
      },
    },
  },
  countdown: {
    list: {
      method: "GET",
      path: "/api/countdown",
      responses: {
        200: z.array(CountdownItemSchema),
      },
    },
  },
  calendar: {
    get: {
      method: "GET",
      path: "/api/calendar",
      query: z.object({ year: z.string(), month: z.string() }).optional(),
      responses: {
        200: z.array(CalendarDaySchema),
      },
    },
  },
} as const;
