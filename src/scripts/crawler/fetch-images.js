#!/usr/bin/env node
import fs from "fs";
import axios from "axios";
import path from "path";
import { slugify } from "./slugify";

const spells = JSON.parse(fs.readFileSync("./spells.json", "utf-8"));
const iconsDir = "./icons";

async function downloadIcon(url, filename) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filename, response.data);
}

async function fetchImages() {
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
  }

  console.log("Fetching images...");

  for (const spell of spells) {
    if (!spell.icon || !spell.name) {
      console.warn(
        `Skipping spell with missing icon or name: ${JSON.stringify(spell)}`
      );
      continue;
    }
    const ext = path.extname(new URL(spell.icon).pathname) || ".png";
    const fileName = path.join(iconsDir, `${slugify(spell.name)}${ext}`);
    if (!fs.existsSync(fileName)) {
      try {
        await downloadIcon(spell.icon, fileName);
        console.log(`Downloaded: ${fileName}`);
      } catch (e) {
        console.error(`Failed: ${spell.name} (${spell.icon})`);
      }
    }
  }
}

fetchImages()
  .then(() => console.log("All images fetched successfully!"))
  .catch((error) => console.error("Error fetching images:", error));
