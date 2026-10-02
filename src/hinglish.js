// Lightweight, rule-based English -> Hinglish gloss for B-roll search queries.
// Not a real translator — just enough to tell a Hinglish reader (10th-pass,
// not fluent in English) what kind of clip to look for. The original English
// query is always shown alongside this too, for reference.

const DEMO = {
  senior: "budhe/senior", older: "budhe/senior", elderly: "budhe/senior",
  "middle aged": "middle-age ke",
  young: "jawan/young",
  man: "aadmi", men: "aadmi log", woman: "mahila", women: "mahila log",
  male: "male (mard)", female: "female (aurat)",
  person: "insaan", people: "log", adults: "log",
  couple: "couple (do log)", family: "family", patient: "patient",
  doctor: "doctor", nurse: "nurse", researcher: "researcher", scientist: "scientist",
  friends: "dost log", "office worker": "office worker", "office workers": "office workers",
};

const ACTIONS = {
  walking: "chal rahe", walks: "chal rahe", walk: "chalte huve",
  running: "daud rahe", eating: "khana kha rahe", drinking: "pi rahe",
  sitting: "baithe huve", standing: "khade huve", sleeping: "so rahe",
  checking: "check kar rahe", holding: "pakde huve", talking: "baat kar rahe",
  cooking: "khana bana rahe", smiling: "muskura rahe", laughing: "has rahe",
  thinking: "soch rahe", writing: "likh rahe", typing: "type kar rahe",
  pointing: "point kar rahe", reading: "padh rahe", listening: "sun rahe",
  driving: "drive kar rahe", resting: "aaram kar rahe", scanning: "scan kar rahe",
  pricking: "prick kar rahe", glancing: "dekh rahe", tapping: "tap kar rahe",
  stepping: "step le rahe", finishing: "khatam kar rahe", flowing: "flow ho rahe",
  moving: "move ho rahe", opening: "khul rahe", closing: "band ho rahe",
};

const SETTINGS = {
  park: "park mein", kitchen: "kitchen mein", home: "ghar mein",
  office: "office mein", clinic: "clinic mein", hospital: "hospital mein",
  street: "street/raaste par", table: "table par", bed: "bed par",
  outdoors: "bahar", morning: "subah ke time", evening: "shaam ke time",
  night: "raat ko", dusk: "shaam dhalte waqt", indoors: "andar/ghar ke andar",
  neighborhood: "mohalle mein", desk: "desk par", laboratory: "lab mein",
  sidewalk: "footpath par", "dining table": "dining table par", couch: "sofe par",
  tv: "TV ke saamne",
};

const EXTRA = {
  "close up": "(close-up shot)", "slow motion": "(slow-motion mein)",
  "medical animation": "(medical animation style — real log nahi, animated)",
  microscope: "(microscope view)",
  briskly: "tez", calmly: "aaram se", relaxed: "relaxed tareeke se",
};

function norm(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function extractAll(text, dict) {
  let remaining = text;
  const found = [];
  const keys = Object.keys(dict).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (remaining.includes(k)) {
      found.push(dict[k]);
      remaining = remaining.replace(new RegExp(k, "g"), " ");
    }
  }
  return { found: [...new Set(found)], remaining };
}

export function toHinglish(query) {
  let text = norm(query);
  const demo = extractAll(text, DEMO); text = demo.remaining;
  const action = extractAll(text, ACTIONS); text = action.remaining;
  const setting = extractAll(text, SETTINGS); text = setting.remaining;
  const extra = extractAll(text, EXTRA); text = extra.remaining;

  const leftover = text.split(" ").filter((w) => w.length > 2);

  const parts = [];
  if (demo.found.length) parts.push(demo.found.join(" "));
  if (action.found.length) parts.push(action.found.join(" "));
  if (setting.found.length) parts.push(setting.found.join(" "));
  if (leftover.length) parts.push(leftover.join(" "));
  if (extra.found.length) parts.push(extra.found.join(" "));

  const sentence = parts.length ? parts.join(", ") : query;
  return `${sentence} — aisa clip dhundho`;
}
