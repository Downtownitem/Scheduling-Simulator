import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ReactCompilerConfig = {
  target: "18",
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
  ],
  server: {
    allowedHosts: ['development.neurilabs.com'],
    port: 8000,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:8080",
  },
});
