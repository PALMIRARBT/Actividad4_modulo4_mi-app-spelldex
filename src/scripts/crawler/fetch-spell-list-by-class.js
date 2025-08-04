#!/usr/bin/env node
import axios from "axios";
import { load } from "cheerio";
import fs from "fs";
import { slugify } from "./slugify.js";

const SOURCE = {
  bard: "https://bg3.wiki/wiki/List_of_Bard_spells",
  cleric: "https://bg3.wiki/wiki/List_of_Cleric_spells",
  druid: "https://bg3.wiki/wiki/List_of_Druid_spells",
  sorcerer: "https://bg3.wiki/wiki/List_of_Sorcerer_spells",
  warlock: "https://bg3.wiki/wiki/List_of_Warlock_spells",
  wizard: "https://bg3.wiki/wiki/List_of_Wizard_spells",
};

const TABLE_CLASS = ".wikitable";
const CONTENT_ID = "#mw-content-text";

async function fetchPage(url) {
  console.log(`Fetching ${url}...`);
  const response = await axios.get(url);
  return load(response.data);
}

/**
 * <td>
 *   <span class="bg3wiki-icontext-icon-wrapper" style="display: inline-flex; align-items: center; justify-content: center; min-width: 40px; height: 40px;"><span class="bg3wiki-icontext-icon" style="vertical-align: middle;"><a href="/wiki/Acid_Splash" title="Acid Splash"><img alt="Acid Splash" src="/w/images/thumb/9/99/Acid_Splash_Icon.webp/40px-Acid_Splash_Icon.webp.png" decoding="async" width="40" height="40" class="bg3wiki-icon" srcset="/w/images/thumb/9/99/Acid_Splash_Icon.webp/60px-Acid_Splash_Icon.webp.png 1.5x, /w/images/thumb/9/99/Acid_Splash_Icon.webp/80px-Acid_Splash_Icon.webp.png 2x"></a><span class="bg3wiki-after-icon"></span></span></span>&nbsp;<span class="bg3wiki-icontext-text"><a href="/wiki/Acid_Splash" title="Acid Splash">Acid Splash</a></span>
 * </td>
 */
function parseTable($) {
  const spellNames = [];

  $(`${CONTENT_ID} ${TABLE_CLASS} tbody tr`).each((_, row) => {
    const firstCell = $(row).find("td").first();

    let spellName = firstCell.find(".bg3wiki-icontext-text a").text().trim();

    if (!spellName) {
      spellName = firstCell.find("a").text().trim();
    }

    if (spellName) {
      spellNames.push(slugify(spellName));
    }
  });

  return spellNames;
}

async function fetchSpellListOfClass(className) {
  const url = SOURCE[className];
  if (!url) {
    throw new Error(`No URL found for class: ${className}`);
  }

  try {
    const $ = await fetchPage(url);
    return parseTable($);
  } catch (error) {
    console.error(`Error fetching spell list for ${className}:`, error);
    throw error;
  }
}

async function fetchAllSpellListsByClass() {
  const spellLists = {};
  for (const className of Object.keys(SOURCE)) {
    try {
      console.log(`Fetching spells for ${className}...`);
      spellLists[className] = await fetchSpellListOfClass(className);
      console.log(
        `Found ${spellLists[className].length} spells for ${className}`
      );
    } catch (error) {
      console.error(`Failed to fetch spells for ${className}:`, error);
      spellLists[className] = []; // Empty array in case of failure
    }
  }
  return spellLists;
}

async function run({ outputPath }) {
  try {
    const spellLists = await fetchAllSpellListsByClass();
    fs.writeFileSync(outputPath, JSON.stringify(spellLists, null, 2), "utf-8");
    console.log(`Successfully wrote spell lists to ${outputPath}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run({
  outputPath: "./spells-by-class.json",
});
