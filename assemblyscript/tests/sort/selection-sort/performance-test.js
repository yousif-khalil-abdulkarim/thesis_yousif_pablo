// @ts-check
import { resolve } from "node:path";
import {
  excuteWithLogging,
  getSystemInfo,
  prettifyObjectKeys,
  withCsv,
} from "../../performance-test-helper.js";
import { readdirSync } from "node:fs";
import { TEST_ITERATION_AMOUNT } from "../../config.js";

const fileNames = readdirSync("./tests/performance/selection-sort")
  .filter((file) => file.endsWith(".html"))
  .map((file) => file.split(".")[0])
  .sort((a, b) => {
    const aNbr = Number(a.replace("_", ""));
    const bNbr = Number(b.replace("_", ""));
    if (aNbr < bNbr) {
      return -1;
    }
    if (aNbr > bNbr) {
      return 1;
    }
    return 0;
  });

for (const fileName of fileNames) {
  await withCsv(resolve("./tests/performance/selection-sort"), fileName, async (csv) => {
    /**
     * @type{Omit<import("../../performance-test-helper.js").IExcuteOptions, "browser">}
     */
    const settings = {
      filePath: resolve(`./tests/performance/selection-sort/${fileName}.html`),
      iterationAmount: TEST_ITERATION_AMOUNT,
      async onPerformanceMessage(performanceMessage) {
        csv.write(
          prettifyObjectKeys({
            ...getSystemInfo(),
            ...performanceMessage,
          })
        );
      },
    };
    await excuteWithLogging({
      browser: "chrome",
      ...settings,
    });
    await excuteWithLogging({
      browser: "firefox",
      ...settings,
    });
  });
}
