import {defineConfig} from "vite";
import {build} from "tsup";
import {entry, outDir} from "./vite.paths";

export default defineConfig({
  build: {
    outDir: outDir,
    sourcemap: true,
    lib: {
      entry: entry,
      name: "Decimal",
      formats: ["es", "cjs", "umd"],
      fileName: (format) => {
        const name = "break_infinity";
        switch (format) {
          case "es":
            return name + ".esm.js";
          case "cjs":
            return name + ".cjs.js";
          case "umd":
            return name + ".min.js";
        }

        throw Error(`Unknown format ${format}`)
      }
    }
  },
  plugins: [{
    closeBundle: () => {
      return build({
        entry: [entry],
        outDir: outDir,
        dts: {
          entry: [entry],
          only: true
        }
      })
    },
  }]
})