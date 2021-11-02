import { defineConfig } from "vite";
import format from "date-fns/format";
import addHours from "date-fns/addHours";

const timestamp = format(addHours(new Date(), 7), "MMM dd, yyyy hh:mm aa");

export default defineConfig({
  define: {
    __APP_VERSION__: `"Released on ${timestamp} (${
      process.env.BUILD_ID || "BUILD_ID"
    })"`,
  },
});
