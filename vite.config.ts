import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // The harness assigns a free port when 3000 is taken by another session.
    port: Number(process.env.PORT) || 3000,
    host: true,
  },
  // Resolves the "@/*" alias declared in tsconfig.json (native since Vite 8).
  resolve: {
    tsconfigPaths: true,
  },
  // nitro() compiles the server build into the shape a host expects. Vercel
  // detects it and needs no build command or output directory of its own.
  plugins: [tailwindcss(), tanstackStart(), nitro(), viteReact()],
});
