/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");

const directory = "dist";

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    if (file.endsWith("index.d.ts")) {
      continue;
    }
    if (!file.endsWith("d.ts")) {
      continue;
    }
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});