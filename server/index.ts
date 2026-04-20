import { serve } from "@hono/node-server";
import { createApp } from "./app";

const DEFAULT_PORT = 3000;

function resolvePort(): number {
  const raw = process.env.PORT;
  if (!raw) return DEFAULT_PORT;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${raw} (expected 1-65535)`);
  }
  return port;
}

async function main() {
  const app = createApp({ serveClient: true });
  const port = resolvePort();

  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
