// initial setup

import { initExpressApp } from "./app";
import { PORT } from "./constant";

async function start() {
  const app = await initExpressApp();

  const server = app.listen(PORT, () => {
    console.info(`Docs can be found on http://localhost:${PORT}/docs`);
  });

  process.on("SIGINT", async () => {
    server.close(() => {
      console.log(`Server Closed`);
      process.exit(0);
    });
  });

  process.on("SIGTERM", async () => {
    server.close(() => {
      console.log(`Server Closed`);
      process.exit(0);
    });
  });

  process.on("uncaughtException", (err) => {
    console.error(`UncaughtException`, err);
  });
}

start();
