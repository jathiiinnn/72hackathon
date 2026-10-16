import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const output = path.join(root, "docs", "reference-data");
const viewports = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "390x844", width: 390, height: 844 },
];

await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

for (const viewport of viewports) {
  await page.setViewportSize(viewport);
  await page.goto("https://huyml.co", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));

  const prefix = path.join(output, viewport.name);
  await page.screenshot({ path: `${prefix}-full.png`, fullPage: true });
  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (const [index, progress] of [0, 0.25, 0.5, 0.75, 1].entries()) {
    await page.evaluate((ratio) => window.scrollTo({ top: (document.documentElement.scrollHeight - window.innerHeight) * ratio, behavior: "auto" }), progress);
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${prefix}-scroll-${index}.png` });
  }

  const rendered = await page.evaluate(() => {
    const styleKeys = ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textTransform", "color", "backgroundColor", "border", "borderRadius", "padding", "margin", "gap", "display", "position", "zIndex", "opacity", "transform", "transition"];
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
    };
    const styles = [...document.querySelectorAll("*")].filter(visible).map((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return { tag: element.tagName.toLowerCase(), className: String(element.className || ""), text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 160), boundingBox: { x: rect.x, y: rect.y, w: rect.width, h: rect.height }, computed: Object.fromEntries(styleKeys.map((key) => [key, style[key]])) };
    });
    const root = getComputedStyle(document.documentElement);
    const customProperties = Object.fromEntries([...root].filter((name) => name.startsWith("--")).map((name) => [name, root.getPropertyValue(name).trim()]));
    const fonts = [...document.styleSheets].flatMap((sheet) => { try { return [...sheet.cssRules].filter((rule) => rule.type === CSSRule.FONT_FACE_RULE).map((rule) => rule.cssText); } catch { return []; } });
    const images = [...document.querySelectorAll("img, svg")].map((element) => { const rect = element.getBoundingClientRect(); const style = getComputedStyle(element); return { tag: element.tagName.toLowerCase(), src: element.currentSrc || element.getAttribute("src") || null, viewBox: element.getAttribute("viewBox"), renderedSize: { w: rect.width, h: rect.height }, objectFit: style.objectFit }; });
    return { viewport: { width: innerWidth, height: innerHeight }, scrollHeight: document.documentElement.scrollHeight, customProperties, fonts, images, styles };
  });

  await fs.writeFile(`${prefix}.json`, JSON.stringify({ ...rendered, capturedAt: new Date().toISOString(), totalHeight }, null, 2));
  await fs.writeFile(`${prefix}.html`, await page.locator("html").evaluate((element) => element.outerHTML));

  const frameDir = path.join(output, `${viewport.name}-frames`);
  await fs.mkdir(frameDir, { recursive: true });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.screenshot({ path: path.join(frameDir, "load.png") });
  for (const progress of [0.25, 0.5, 0.75, 1]) {
    await page.evaluate((ratio) => window.scrollTo({ top: (document.documentElement.scrollHeight - window.innerHeight) * ratio, behavior: "auto" }), progress);
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(frameDir, `scroll-${progress}.png`) });
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  const menu = page.getByText("Menu", { exact: true }).first();
  if (await menu.count()) { await menu.click().catch(() => {}); await page.waitForTimeout(250); await page.screenshot({ path: path.join(frameDir, "menu-open.png") }); await page.keyboard.press("Escape").catch(() => {}); }
}

await browser.close();
