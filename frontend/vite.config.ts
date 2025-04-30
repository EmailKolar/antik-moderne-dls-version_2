import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  optimizeDeps: {
    exclude: ['@chakra-ui/react'],
  },
  server: {
    allowedHosts: ['86be-195-249-146-101.ngrok-free.app']
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
