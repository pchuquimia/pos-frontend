import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 👇 Esto permite que tu app acepte conexiones desde túneles
    allowedHosts: [".trycloudflare.com"],
    // opcional: si usas puertos distintos
    port: 5173,
  },
});
