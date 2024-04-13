// @ts-check
import { resolve } from "node:path";
import {
  excuteWithLogging,
  getSystemInfo,
  prettifyObjectKeys,
  withCsv,
} from "../../cpu-test-helper.js";
import { readdirSync } from "node:fs";

const fileNames = readdirSync("./tests/basic/average")
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
  await withCsv(resolve("./tests/basic/average"), fileName, async (csv) => {
    /**
     * @type{Omit<import("../../cpu-test-helper.js").IExcuteOptions, "browser">}
     */
    const settings = {
      filePath: resolve(`./tests/basic/average/${fileName}.html`),
      iterationAmount: 1,
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
