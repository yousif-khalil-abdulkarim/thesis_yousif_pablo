// @ts-check
import { cpus, arch, type, version } from "node:os";
import { launch } from "puppeteer";
import capitalize from "lodash.capitalize";
import snakecase from "lodash.snakecase";
import { format } from "fast-csv";
import { writeFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * @typedef {{
 *  start: string;
 *  end: string;
 *  time: string;
 * }} IPerformanceMessage
 */

/**
 * @typedef {"chrome"|"firefox"} TBrowser
 */

/**
 * @param {string} text
 * @returns {IPerformanceMessage}
 */
function transformToPerformanceMessage(text) {
  const rows = text.split("\n");
  const start = rows[1].split(":")[1].replace(/\s/g, "").replace(/\n/g, "");
  const end = rows[2].split(":")[1].replace(/\s/g, "").replace(/\n/g, "");
  const time = rows[3].split(":")[1].replace(/\s/g, "").replace(/\n/g, "");

  return {
    start,
    end,
    time,
  };
}

/**
 * @typedef {(performance: IPerformanceMessage) => Promise<void>} TOnPerformanceMessage
 */

/**
 * @typedef {{
 *  browser: import("puppeteer").Browser;
 *  filePath: string;
 *  onPerformanceMessage?: TOnPerformanceMessage;
 * }} IExecuteTestOptions
 */

/**
 * @param {IExecuteTestOptions} options
 */
async function executeTest(options) {
  const { filePath, browser, onPerformanceMessage } = options;
  console.log("filePath:");
  console.log(filePath);

  const page = await browser.newPage();
  page.on("console", async (message) => {
    if (message.type() !== "log") {
      return;
    }
    const text = message.text();
    if (!text.startsWith("Perfomance!")) {
      return;
    }
    const performanceMessage = transformToPerformanceMessage(text);
    if (onPerformanceMessage) {
      await onPerformanceMessage(performanceMessage);
    }
  });

  const testFilePath = `file://${filePath}`;
  await page.goto(testFilePath);
  await page.close();
}

/**
 * @typedef {IPerformanceMessage & {
 *  iteration: number;
 *  iterationAmount: number
 * }} IPerformanceMessageWithIndex
 */

/**
 * @typedef {(performance: IPerformanceMessageWithIndex) => Promise<void>} TOnPerformanceMessageWithIndex
 */

/**
 * @typedef {{
 *  browser: import("puppeteer").Browser;
 *  filePath: string;
 *  onPerformanceMessage?: TOnPerformanceMessageWithIndex;
 *  iterationAmount: number;
 * }} IExecuteTestRepeatOptions
 */

/**
 * @param {IExecuteTestRepeatOptions} options
 */
async function executeTestRepeat(options) {
  const { iterationAmount, onPerformanceMessage, ...rest } = options;
  const start = performance.now();
  for (let i = 0; i < iterationAmount; i++) {
    await executeTest({
      ...rest,
      async onPerformanceMessage(performanceMessage) {
        if (onPerformanceMessage) {
          await onPerformanceMessage({
            iterationAmount,
            iteration: i + 1,
            ...performanceMessage,
          });
        }
      },
    });
    console.log("\n");
  }
  const end = performance.now();
  const testTime = end - start;
  console.log("testTime:", testTime);
}

/**
 * @typedef {IPerformanceMessage & {
 *  browser: string
 *  iteration: number;
 *  iterationAmount: number;
 * }} IEnhancedPerformanceMessage
 */

/**
 * @typedef {(enhancedPerformance: IEnhancedPerformanceMessage) => Promise<void>} TOnEnhancedPerformanceMessage
 */

/**
 * @typedef {{
 *  browser: TBrowser;
 *  filePath: string;
 *  onPerformanceMessage?: TOnEnhancedPerformanceMessage;
 *  iterationAmount: number;
 * }} IExcuteOptions
 */

/**
 * @param {IExcuteOptions} options
 */
async function excute(options) {
  const { browser: browser_, onPerformanceMessage, ...rest } = options;
  const browser = await launch({
    product: browser_,
    protocol: browser_ === "chrome" ? "cdp" : "webDriverBiDi",
    headless: true,
    args: ["--disable-web-security"],
  });
  await executeTestRepeat({
    ...rest,
    browser,
    async onPerformanceMessage(performanceMessage) {
      if (onPerformanceMessage) {
        await onPerformanceMessage({
          browser: await browser.version(),
          ...performanceMessage,
        });
      }
    },
  });
  await browser.close();
}

/**
 * @param {IExcuteOptions} options
 */
export async function excuteWithLogging(options) {
  const { onPerformanceMessage, ...rest } = options;
  await excute({
    ...rest,
    async onPerformanceMessage(performanceMessage) {
      if (onPerformanceMessage) {
        await onPerformanceMessage(performanceMessage);
      }
      console.log(performanceMessage);
    },
  });
}

/**
 * @template T
 * @param {T[]} items
 * @returns {T[]}
 */
function removeDuplicates(items) {
  return [...new Set(items)];
}

export function getSystemInfo() {
  const cpuInfo = cpus();
  const cpuModel = removeDuplicates(cpuInfo.map((info) => info.model)).join(
    ", "
  );
  return {
    cpuModel: cpuModel.trim(),
    architecture: arch().trim(),
    operatingSystemType: type(),
    operatingSystemVersion: version(),
  };
}

/**
 *
 * @param {Record<string, any>} object
 * @returns {Record<string, any>}
 */
export function prettifyObjectKeys(object) {
  return Object.fromEntries(
    Object.entries(object).map(([field, value]) => {
      const newField = capitalize(snakecase(field).split("_").join(" "));
      return [newField, `${value}`];
    })
  );
}

/**
 * @param {string} fileName
 * @param {string} directory
 * @param {(csv: import("fast-csv").CsvFormatterStream) => Promise<void>} callback
 */
export async function withCsv(directory, fileName, callback) {
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }
  if (!existsSync(join(directory, "performance"))) {
    mkdirSync(join(directory, "performance"));
  }
  const file = join(directory, "performance", `${fileName}.csv`);
  const csv = format({
    headers: true,
    delimiter: " , ",
  });
  await callback(csv);
  csv.end();
  console.log("file!!!:");
  console.log(file);
  await writeFile(file, csv);
}
