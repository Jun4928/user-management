// initial setup

import { initExpressApp } from "./app";

async function start() {
  const app = await initExpressApp();

  const server = app.listen(3000, () => {
    console.info(`Docs can be found on http://localhost:3000/docs`);
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
