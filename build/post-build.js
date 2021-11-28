/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");

const directory = "dist";

const files = fs.readdirSync(directory);

for (const file of files) {
  if (file.endsWith("break_infinity.js.d.ts")) {
    continue;
  }
  if (!file.endsWith("d.ts")) {
    continue;
  }
  fs.unlinkSync(path.join(directory, file));
}

fs.rmdirSync(path.join(directory, "modules"), { recursive: true, force: true });