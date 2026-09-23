import { access, readdir, readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const missing = [];

const collectTargets = (value) => {
  if (typeof value === "string") return value.startsWith("./dist/") ? [value] : [];
  if (!value || typeof value !== "object") return [];
  return Object.values(value).flatMap(collectTargets);
};

const targets = new Set(
  [manifest.main, manifest.module, manifest.types, ...collectTargets(manifest.exports)].filter(
    (value) => typeof value === "string" && value.startsWith("./dist/"),
  ),
);

for (const target of targets) {
  try {
    await access(resolve(root, target));
  } catch {
    missing.push(target);
  }
}

if (missing.length > 0) {
  throw new Error(`Package manifest references missing build output:\n${missing.join("\n")}`);
}

const restrictedPath =
  /(?:^|\/)(?:live2d|cubism|character-models?)(?:\/|$)|\.(?:moc3|model3\.json|motion3\.json|physics3\.json|cdi3\.json|wasm|dll|dylib|so)$/iu;
const published = [];

const walk = async (path, relative) => {
  const info = await stat(path);
  if (info.isDirectory()) {
    for (const entry of await readdir(path)) {
      await walk(resolve(path, entry), relative ? `${relative}/${entry}` : entry);
    }
    return;
  }
  published.push(relative);
};

for (const entry of manifest.files ?? []) {
  await walk(resolve(root, entry), entry);
}

const restricted = published.filter((path) => restrictedPath.test(path));
if (restricted.length > 0) {
  throw new Error(`Restricted runtime or model payload found in package files:\n${restricted.join("\n")}`);
}

console.log(`Verified ${targets.size} export targets and ${published.length} publishable files.`);
