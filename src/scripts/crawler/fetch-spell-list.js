#!/usr/bin/env node
import axios from "axios";
import { load } from "cheerio";
import fs from "fs";

import { slugify } from "./slugify.js";
import { parseDamage } from "./parse-damage.js";

const CONTENT_ID = "#mw-content-text";
const TABLE_CLASS = ".wikitable";

async function fetchPage(url) {
  const response = await axios.get(url);
  return load(response.data);
}

/**
<tr>
<td><span class="bg3wiki-icontext-icon-wrapper" style="display: inline-flex; align-items: center; justify-content: center; min-width: 40px; height: 40px;"><span class="bg3wiki-icontext-icon" style="vertical-align: middle;"><a href="/wiki/Bone_Chill" title="Bone Chill"><img alt="Bone Chill" src="/w/images/thumb/0/03/Bone_Chill_Icon.webp/40px-Bone_Chill_Icon.webp.png" decoding="async" width="40" height="40" class="bg3wiki-icon" srcset="/w/images/thumb/0/03/Bone_Chill_Icon.webp/60px-Bone_Chill_Icon.webp.png 1.5x, /w/images/thumb/0/03/Bone_Chill_Icon.webp/80px-Bone_Chill_Icon.webp.png 2x"></a><span class="bg3wiki-after-icon"></span></span></span>&nbsp;<span class="bg3wiki-icontext-text"><a href="/wiki/Bone_Chill" title="Bone Chill">Bone Chill</a></span></td>
<td style="text-align:right;"><span class="bg3wiki-help-tooltip" aria-label="Cantrip">C</span></td>
<td style="text-align:center;"><span class="noexcerpt navigation-not-searchable" aria-label="Benefits from upcast"><img alt="" src="/w/images/2/2f/Upcast_Icon.png" decoding="async" width="20" height="20" class="bg3wiki-icon"><span class="bg3wiki-after-icon"></span></span></td>
<td style="text-align: center; vertical-align: middle;"><span style="display:inline-block"><a href="/wiki/Action" title="Action"><img alt="Action" src="/w/images/thumb/f/f2/Action_Icon.png/25px-Action_Icon.png" decoding="async" width="25" height="25" srcset="/w/images/thumb/f/f2/Action_Icon.png/38px-Action_Icon.png 1.5x, /w/images/f/f2/Action_Icon.png 2x"></a></span></td>
<td style="text-align: center; vertical-align: middle;"><img alt="" src="/w/images/thumb/6/6a/Duration_Icons.png/25px-Duration_Icons.png" decoding="async" width="25" height="25" class="bg3wiki-icon" srcset="/w/images/thumb/6/6a/Duration_Icons.png/38px-Duration_Icons.png 1.5x, /w/images/thumb/6/6a/Duration_Icons.png/50px-Duration_Icons.png 2x"><span class="bg3wiki-after-icon"></span> 1 turn</td>
<td><img alt="" src="/w/images/thumb/0/08/Range_Icon.png/25px-Range_Icon.png" decoding="async" width="25" height="25" class="bg3wiki-icon" srcset="/w/images/thumb/0/08/Range_Icon.png/38px-Range_Icon.png 1.5x, /w/images/0/08/Range_Icon.png 2x"><span class="bg3wiki-after-icon"></span> 18 m /  60ft</td>
<td style="text-align: center; vertical-align: middle;"><img alt="" src="/w/images/thumb/b/ba/Attack_Roll_Icon.png/25px-Attack_Roll_Icon.png" decoding="async" width="25" height="25" class="bg3wiki-icon" srcset="/w/images/thumb/b/ba/Attack_Roll_Icon.png/38px-Attack_Roll_Icon.png 1.5x, /w/images/thumb/b/ba/Attack_Roll_Icon.png/50px-Attack_Roll_Icon.png 2x"><span class="bg3wiki-after-icon"></span><a href="/wiki/Attack_roll" class="mw-redirect" title="Attack roll">Attack roll</a>
</td>
 */
function parseTable($) {
  const spells = [];

  $(`${CONTENT_ID} ${TABLE_CLASS} tbody tr`).each((_, row) => {
    const columns = $(row).find("td");
    if (columns.length === 0) return;

    const name = $(columns[0]).find("a").attr("title") || "";
    const url = $(columns[0]).find("a").attr("href") || "";
    const icon = $(columns[0]).find("img").attr("src") || "";
    const levelText = $(columns[1]).text().trim();
    const level = levelText === "C" ? 0 : parseInt(levelText, 10) || null;
    const upcast = $(columns[2]).find("img").length > 0;
    const action = $(columns[3]).find("a").attr("title") || "";
    const duration = $(columns[4]).text().trim();
    const range = $(columns[5]).text().trim();
    const type = $(columns[6]).text().trim();
    const damage = $(columns[7]).text().trim();

    spells.push({
      id: slugify(name),
      url: `https://bg3.wiki${url}`,
      name,
      icon: `https://bg3.wiki${icon}`,
      level,
      upcast,
      action,
      duration,
      range,
      type,
      damage: parseDamage(damage),
    });
  });

  return spells;
}

async function run({ url, outputPath }) {
  try {
    const $ = await fetchPage(url);
    const spells = parseTable($);

    fs.writeFileSync(outputPath, JSON.stringify(spells, null, 2), "utf-8");

    console.log(`Spells data has been saved to ${outputPath}`);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

run({
  url: "https://bg3.wiki/wiki/List_of_all_spells_(sortable)",
  outputPath: "./spells.json",
});
