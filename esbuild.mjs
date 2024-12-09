import esbuild from "esbuild";
import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin";
import dotenv from "dotenv";
dotenv.config();
esbuild.build({
  entryPoints: ["./src/index.ts"],
  outdir: "dist",
  sourcemap: true,
  bundle: true,
  platform: "node",
  target: "node20.14.0",
  plugins: [
    // Put the Sentry esbuild plugin after all other plugins
    sentryEsbuildPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "codepeaktrail",
      project: "climbing-journal",
      disable: process.env.NODE_ENV === "development",
    }),
  ],
  external: [
    "@sentry/profiling-node",
    "@sentry/node",
    "swagger-ui-express",
    "swagger-jsdoc",
  ],
});
