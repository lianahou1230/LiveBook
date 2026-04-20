import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import nodeAdapter from "@hono/vite-dev-server/node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export default defineConfig(async ({ command }) => {
  const runtimePort = command === "serve" ? resolvePort() : null;
  const enableComponentDebugger = command === "serve";
  const componentDebugger =
    enableComponentDebugger
      ? (await import("vite-plugin-component-debugger")).default
      : null;

  return {
    root: path.resolve(__dirname, "client"),
    server:
      runtimePort === null
        ? undefined
        : {
            host: "0.0.0.0",
            port: runtimePort,
            strictPort: true,
            hmr: { overlay: false },
          },
    plugins: [
      componentDebugger
        ? componentDebugger({
            attributePrefix: "data-cd",
            includeAttributes: ["id", "path", "line", "file", "component", "metadata"],
            includePaths: ["client/src/**/*.tsx", "client/src/**/*.jsx"],
          })
        : null,
      react(),
      devServer({
        entry: path.resolve(__dirname, "server/dev-app.ts"),
        adapter: nodeAdapter,
        exclude: [/^\/(?!(?:api|__health)(?:\/|$)).*/, ...defaultOptions.exclude],
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client/src"),
        "@shared": path.resolve(__dirname, "shared"),
      },
    },
    build: {
      outDir: path.resolve(__dirname, "dist/client"),
      emptyOutDir: true,
    },
  };
});
