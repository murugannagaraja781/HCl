const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/api/auth", createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true,
  pathRewrite: {
    "^/api/auth": "/auth"
  }
}));

app.use("/api/applications", createProxyMiddleware({
  target: "http://localhost:3003",
  changeOrigin: true,
  pathRewrite: {
    "^/api/applications": ""
  }
}));


app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});
