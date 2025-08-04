// values:
// -
// xdy{type}
// Normal weapon damage1d8Thunder
// xdy{type}xdy{type}xdy{type}
export function parseDamage(d) {
  if (d === "-") {
    return [];
  }

  let match = d.match(/^(\d+d\d+)([A-Za-z]+)$/);
  if (match) {
    const [_, dice, damageType] = match;
    return [{ dice, damageType }];
  }

  match = d.match(/^Normal weapon damage(\d+d\d+)([A-Za-z]+)$/);
  if (match) {
    const [_, dice, damageType] = match;
    return [{ dice, damageType, weapon: true }];
  }

  // Match multiple dice+type pairs, e.g. 1d8fire2d10cold
  match = d.match(/(\d+d\d+[A-Za-z]+)/g);
  if (match) {
    return match
      .map((part) => {
        const m = part.match(/(\d+d\d+)([A-Za-z]+)/);
        if (m) {
          const [_, dice, damageType] = m;
          return { dice, damageType };
        }
        return null;
      })
      .filter(Boolean);
  }

  console.warn(`Unknown damage format: ${d}`);
}
