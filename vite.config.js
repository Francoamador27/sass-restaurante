import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000 // 3 MB
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "robots.txt",
      ],
      manifest: {
        name: "Dental Cor Software - Sistema Odontológico",
        short_name: "Dental Cor",
        description:
          "Sistema odontológico para clínicas y consultorios: turnos, historia clínica, obras sociales y más.",
        theme_color: "#343541",       // podés cambiarlo al color principal de tu marca
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/auth/login",
        scope: "/",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        categories: ["medical", "productivity", "business"],
        lang: "es-AR",
      },
    }),
  ],
});
