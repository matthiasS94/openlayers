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
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://meine-api.com", // Ziel-API
      changeOrigin: true,
      secure: false,
      pathRewrite: { "^/api": "" },
    })
  );

  // use Vite in frontend
  app.use(vite.middlewares);

  // starte xpress-Server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server runs: http://localhost:${PORT}`);
  });
}

startServer();
