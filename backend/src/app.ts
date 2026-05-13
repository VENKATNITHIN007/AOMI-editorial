import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDB from "./db";

import { createVersionRoute } from "./utils/core/route.util";
import errorHandler from "./middlewares/errorHandler.middleware";
import { apiRateLimiter } from "./middlewares/rateLimiter.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { requestLogger } from "./middlewares/logger.middleware";
import { csrfProtection } from "./middlewares/csrf.middleware";

import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import photographerRouter from "./routes/photographer.route";
import portfolioRouter from "./routes/portfolio.route";
import helmet from "helmet";
import { initPinger } from "./utils/helper/pinger.util";

// Read allowed frontend origins from ORIGIN_HOSTS env variable.
// If it exists, convert the comma-separated string into an array and remove spaces.
// If it does not exist, fall back to default localhost origins.
const allowedHost: string[] = process.env.ORIGIN_HOSTS
  ? process.env.ORIGIN_HOSTS.split(",").map((h: string) => h.trim())
  : ["http://localhost:3000", "http://localhost:3002"];


const port = process.env.PORT || 3002;

const app = express();

if (process.env.TRUST_PROXY) {
  app.set("trust proxy", 1);
}

/**
 * Security middlewares learn more about headers 
 */
app.use(helmet());
app.use(requestLogger);


app.use(express.json({ limit: "10MB" }));
app.use(express.urlencoded({ limit: "10MB", extended: true }));
app.use(cookieParser());

/**
 * Cors
 */
app.use(
  cors({
    origin: allowedHost,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(csrfProtection);

/**
 * Health check endpoint for pinger and monitoring
 */
app.get(createVersionRoute("health"), (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * Rate limiting for API routes
 */
app.use("/api", apiRateLimiter);

/**
 * Routing
 */

app.use(createVersionRoute("auth"), authRouter);
app.use(createVersionRoute("users"), userRouter);
app.use(createVersionRoute("photographers"), photographerRouter);
app.use(createVersionRoute("portfolio"), portfolioRouter);


/**
 * 404 errors
 */
app.use(notFoundMiddleware);

/**
 * Error Handing
 */
app.use(errorHandler);

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.info(
        `Dukan backend is running on http://localhost:${port} in ${app.settings.env} mode`,
      );
      // Initialize pinger to keep server awake in production
      initPinger();
    });
  })
  .catch((err) => console.error(err));
