import { Request, Response, NextFunction } from "express";

const FINISH_EVENT = "finish";

export function logger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime();

  res.on(FINISH_EVENT, () => {
    const elapsedHrTime = process.hrtime(start);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    console.log(
      `[${req.method}] ${req.url} | IP: ${req.ip} | Response: ${res.statusCode} ${(elapsedTimeInMs / 1000).toFixed(4)}s`,
    );
  });

  next();
}
