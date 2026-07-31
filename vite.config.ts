import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(root, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["@haneoka/vega/plugin", "@haneoka/vega/shell"],
    },
    sourcemap: true,
    // Keep public ESM symbols readable. Nuxt's auto-import transform can treat
    // single-letter names in linked, minified workspace builds as unresolved
    // Vue helpers and inject a duplicate binding during local integration.
    minify: false,
    target: "es2022",
  },
});
