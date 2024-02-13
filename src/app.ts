import express, { Express } from "express";
import { router } from "./controller/router";
import { errorHandler } from "./middleware/error-handler";
import { TspecDocsMiddleware } from "tspec";

export async function initExpressApp() {
  const app: Express = express();

  app.use(express.json());

  router(app);
  app.use("/docs", await TspecDocsMiddleware());
  app.use(errorHandler);

  return app;
}
