const express = require("express");
const { createServer } = require("vite");
const { createProxyMiddleware } = require("http-proxy-middleware");

async function startServer() {
  const app = express();

  // Use Vite as middleware
  const vite = await createServer({
    server: { middlewareMode: true },
  });

  // proxy api requests
  app.use("/api", (req, res, next) => {
    // dynamic decision, based on request-header and/or URL
    const target = req.headers["x-api-target"] || "https://default-api.com"; // Standard-value

    // Proxy with dynamic target
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      pathRewrite: { "^/api": "" }, // delete "/api" from URL
    })(req, res, next);
  });

  // use Vite in frontend
  app.use(vite.middlewares);

  // starte xpress-Server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server runs: http://localhost:${PORT}`);
  });
}

startServer();
