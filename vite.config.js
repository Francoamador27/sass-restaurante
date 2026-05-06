import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@mui") || id.includes("@emotion"))
            return "vendor-mui";
          if (id.includes("@fullcalendar"))
            return "vendor-fullcalendar";
          if (id.includes("chart.js") || id.includes("react-chartjs"))
            return "vendor-charts";
          if (id.includes("jspdf"))
            return "vendor-pdf";
          if (id.includes("framer-motion"))
            return "vendor-framer";
          if (id.includes("swiper"))
            return "vendor-swiper";
          if (id.includes("@xyflow") || id.includes("reactflow"))
            return "vendor-flow";
          return "vendor";
        },
      },
    },
  },
});
