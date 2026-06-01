const FLAG_CODES: Record<string, string> = {
  // Grupo A
  Mexico: "mx",
  "South Korea": "kr",
  "South Africa": "za",
  "Czech Republic": "cz",

  // Grupo B
  Canada: "ca",
  Switzerland: "ch",
  Qatar: "qa",
  "Bosnia and Herzegovina": "ba",

  // Grupo C
  Brazil: "br",
  Morocco: "ma",
  Scotland: "gb-sct",
  Haiti: "ht",

  // Grupo D
  "United States": "us",
  Paraguay: "py",
  Australia: "au",
  Turkey: "tr",

  // Grupo E
  Germany: "de",
  Curaçao: "cw",
  "Ivory Coast": "ci",
  Ecuador: "ec",

  // Grupo F
  Netherlands: "nl",
  Japan: "jp",
  Tunisia: "tn",
  Sweden: "se",

  // Grupo G
  Belgium: "be",
  Egypt: "eg",
  Iran: "ir",
  "New Zealand": "nz",

  // Grupo H
  Spain: "es",
  "Cape Verde": "cv",
  "Saudi Arabia": "sa",
  Uruguay: "uy",

  // Grupo I
  France: "fr",
  Senegal: "sn",
  Norway: "no",
  Iraq: "iq",

  // Grupo J
  Argentina: "ar",
  Algeria: "dz",
  Austria: "at",
  Jordan: "jo",

  // Grupo K
  Portugal: "pt",
  Colombia: "co",
  Uzbekistan: "uz",
  "DR Congo": "cd",

  // Grupo L
  England: "gb-eng",
  Croatia: "hr",
  Ghana: "gh",
  Panama: "pa",
} as const;

export function getFlagUrl(
  teamName: string,
  size: 40 | 80 | 160 = 80,
): string | null {
  const code = FLAG_CODES[teamName];
  if (!code) return null;
  return `https://flagcdn.com/w${size}/${code}.png`;
}

export function getFlagCode(teamName: string): string | null {
  return FLAG_CODES[teamName] ?? null;
}

export default FLAG_CODES;
