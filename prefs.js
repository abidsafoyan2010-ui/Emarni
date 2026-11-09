// Preferences saved on this device, and the screen layout (phone or desktop) that fits the window.
const KEY = "emarni-prefs-v2";
const DEFAULTS = {
  layout: "auto", // "auto" | "phone" | "desktop"
  theme: "dark", // "dark" | "light" | "auto"
  fog: true,
  reduceMotion: false,
  compact: false,
  largeText: false,
  sound: true,
  cards: true,
  osNotify: true,
  preview: true,
  envTheme: true,
  soundMaster: true,
  soundUi: true,
  soundCalls: true
};

let prefs = { ...DEFAULTS };
let lastDevice = "";
const subs = new Set();
const phoneQuery = window.matchMedia ? window.matchMedia("(max-width: 760px), (pointer: coarse) and (max-width: 1024px)") : null;
const colorSchemeQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

function load() {
  try {
    prefs = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    prefs = { ...DEFAULTS };
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // Storage is blocked (private mode): the choice still lasts for this visit.
  }
}

export function getPref(key) {
  return prefs[key];
}

export function setPref(key, value) {
  prefs[key] = value;
  save();
  apply();
  subs.forEach(fn => fn(prefs));
}

export function resetPrefs() {
  prefs = { ...DEFAULTS };
  save();
  apply();
  subs.forEach(fn => fn(prefs));
}

export function onPrefs(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

// "phone" or "desktop", from the chosen layout or, when set to auto, from the window size.
export function currentDevice() {
  if (prefs.layout === "phone" || prefs.layout === "desktop") return prefs.layout;
  return phoneQuery?.matches ? "phone" : "desktop";
}

function resolvedTheme() {
  if (prefs.theme === "light" || prefs.theme === "dark") return prefs.theme;
  return colorSchemeQuery?.matches ? "light" : "dark";
}

function apply() {
  const root = document.documentElement;
  const device = currentDevice();
  root.dataset.device = device;
  root.dataset.theme = resolvedTheme();
  root.style.colorScheme = resolvedTheme();
  root.classList.toggle("no-fog", !prefs.fog);
  root.classList.toggle("reduce-motion", prefs.reduceMotion);
  root.classList.toggle("compact", prefs.compact);
  root.classList.toggle("text-large", prefs.largeText);
  if (device !== lastDevice) {
    lastDevice = device;
    subs.forEach(fn => fn(prefs));
  }
}

export function initPrefs() {
  load();
  apply();
  phoneQuery?.addEventListener?.("change", apply);
  colorSchemeQuery?.addEventListener?.("change", () => { if (prefs.theme === "auto") apply(); });
  window.addEventListener("resize", apply, { passive: true });
  window.addEventListener("orientationchange", apply);
}
