import https from "https";
import http from "http";
import { appConfig } from "../../config";

/**
 * Self-Pinger Utility for Render Free Tier.
 * Periodically pings the application's own health endpoint using native Node.js modules.
 */
export function initPinger() {
  const interval = 14 * 60 * 1000; // 14 minutes
  const url = appConfig.APP_URL;

  if (!url || process.env.NODE_ENV !== "production") {
    console.log("[PINGER] Self-pinging disabled (No APP_URL or not in production).");
    return;
  }

  console.log(`[PINGER] Initialized. Pinging ${url} every 14 minutes.`);

  // Self-ping loop
  setInterval(() => {
    try {
      const client = url.startsWith("https") ? https : http;
      const target = `${url}/api/v1/health`;

      client.get(target, (res) => {
        console.log(`[PINGER] Keep-alive successful: ${res.statusCode} ${res.statusMessage}`);
      }).on("error", (err) => {
        console.error(`[PINGER] Keep-alive request failed: ${err.message}`);
      });
    } catch (error: any) {
      console.error(`[PINGER] Keep-alive execution error: ${error.message}`);
    }
  }, interval);
}
