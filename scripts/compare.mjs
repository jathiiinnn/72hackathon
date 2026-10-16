import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const output = path.join(root, "docs", "diffs");
const localUrl = process.env.LOCAL_URL || "http://127.0.0.1:5176";
const viewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "390x844", width: 390, height: 844 },
];

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });

const metricScript = () => {
  const targets = ["Gather", "Selected work", "All events", "Menu", "Scroll"];
  return targets.map((text) => {
    const element = [...document.querySelectorAll("body *")].find((node) => node.children.length === 0 && node.textContent?.trim() === text);
    if (!element) return { text, missing: true };
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return { text, box: { x: rect.x, y: rect.y, w: rect.width, h: rect.height }, fontSize: style.fontSize, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, color: style.color };
  });
};

for (const viewport of viewports) {
  const reference = await browser.newPage({ viewport });
  const local = await browser.newPage({ viewport });
  await reference.goto("https://huyml.co", { waitUntil: "networkidle" });
  await local.goto(localUrl, { waitUntil: "networkidle" });
  await reference.waitForTimeout(3000);
  await local.waitForTimeout(1000);

  const referencePath = path.join(output, `${viewport.name}-reference.png`);
  const localPath = path.join(output, `${viewport.name}-local.png`);
  const diffPath = path.join(output, `${viewport.name}-diff.png`);
  const sideBySidePath = path.join(output, `${viewport.name}-side-by-side.png`);
  await reference.screenshot({ path: referencePath });
  await local.screenshot({ path: localPath });

  const referencePng = PNG.sync.read(await fs.readFile(referencePath));
  const localPng = PNG.sync.read(await fs.readFile(localPath));
  const width = Math.min(referencePng.width, localPng.width);
  const height = Math.min(referencePng.height, localPng.height);
  const diff = new PNG({ width, height });
  const referenceCrop = new PNG({ width, height });
  const localCrop = new PNG({ width, height });
  PNG.bitblt(referencePng, referenceCrop, 0, 0, width, height, 0, 0);
  PNG.bitblt(localPng, localCrop, 0, 0, width, height, 0, 0);
  const mismatchedPixels = pixelmatch(referenceCrop.data, localCrop.data, diff.data, width, height, { threshold: 0.1 });
  await fs.writeFile(diffPath, PNG.sync.write(diff));
  const side = new PNG({ width: width * 2, height });
  PNG.bitblt(referenceCrop, side, 0, 0, width, height, 0, 0);
  PNG.bitblt(localCrop, side, 0, 0, width, height, width, 0);
  await fs.writeFile(sideBySidePath, PNG.sync.write(side));
  await fs.writeFile(path.join(output, `${viewport.name}.json`), JSON.stringify({ viewport, mismatchPercentage: (mismatchedPixels / (width * height)) * 100, reference: await reference.evaluate(metricScript), local: await local.evaluate(metricScript) }, null, 2));
  await reference.close();
  await local.close();
}

await browser.close();
