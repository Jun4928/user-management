import express, { Express } from "express";
import { router } from "./controller/router";
import { errorHandler } from "./middleware/error-handler";
import { Tspec, TspecDocsMiddleware } from "tspec";

const tspecParams: Tspec.GenerateParams = {
  openapi: {
    securityDefinitions: {
      jwt: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export async function initExpressApp() {
  const app: Express = express();

  app.use(express.json());

  router(app);
  app.use("/docs", await TspecDocsMiddleware(tspecParams));
  app.use(errorHandler);

  return app;
}
