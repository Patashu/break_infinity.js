import { Config } from "bili";

const config: Config = {
  input: "src/index.ts",
  output: {
    format: ["umd", "umd-min", "esm-min", "cjs-min"],
    moduleName: "Decimal",
    sourceMap: false,
    fileName: (context, defaultFileName) => {
      switch (context.format) {
        case "umd":
          return context.minify ? "break_infinity.min.js" : "break_infinity.js";
        case "esm":
          return "break_infinity.esm.js";
        case "cjs":
          return "break_infinity.common.js";
        default:
          return defaultFileName;
      }
    }
  },
  extendConfig: (config) => {
    return {
      ...config,
      externals: []
    };
  }
};

export default config;
