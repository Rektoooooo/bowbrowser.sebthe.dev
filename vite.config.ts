import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // `npm run share` serves the build to the local network (iPad, phone). Allow the Mac's Bonjour
  // name (e.g. my-mac.local) as well as its IP address.
  preview: { allowedHosts: [".local"] },
});
