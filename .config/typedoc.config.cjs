/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ["../src/index.ts"],
  entryPointStrategy: "expand",
  out: "../docs",
  theme: "default",
};
