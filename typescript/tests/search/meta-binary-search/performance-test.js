// @ts-check
import { resolve } from "node:path";
import {
  excuteWithLogging,
  getSystemInfo,
  prettifyObjectKeys,
  withCsv,
} from "../../cpu-test-helper.js";
import { readdirSync } from "node:fs";

const fileNames = readdirSync("./tests/search/meta-binary-search")
  .filter((file) => file.endsWith(".html"))
  .map((file) => file.split(".")[0]);

for (const fileName of fileNames.slice(0, 1)) {
  await withCsv(fileName, async (csv) => {
    /**
     * @type{Omit<import("../../cpu-test-helper.js").IExcuteOptions, "browser">}
     */
    const settings = {
      filePath: resolve(`./tests/search/meta-binary-search/${fileName}.html`),
      iterationAmount: 2,
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