import { Config } from "bili";

const config: Config = {
    input: "src/index.ts",
    output: {
        format: ["umd", "umd-min", "esm", "cjs"],
        moduleName: "Decimal",
        sourceMap: false,
        fileName: (context, defaultFileName) => {
            switch (context.format) {
                case "umd":
                    return context.minify ? "break_infinity.min.js" : "break_infinity.js";
                case "esm":
                    return "break_infinity.esm.js";
                case "cjs":
                    return "break_infinity.cjs.js";
                default:
                    return defaultFileName;
            }
        }
    }
};

export default config;
