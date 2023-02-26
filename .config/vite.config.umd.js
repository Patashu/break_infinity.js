import {defineConfig} from "vite";
import {entry, outDir} from "./vite.paths";

// A special Vite config for the non-minified break_infinity.js
export default defineConfig({
  build: {
    outDir: outDir,
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry: entry,
      name: "Decimal",
      formats: ["umd"],
      fileName: () => "break_infinity.js"
    }
  }
});