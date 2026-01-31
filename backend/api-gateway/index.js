const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/auth", createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true,
  pathRewrite:{
    "^/auth":"/auth"
  }
}));

app.use("/pan", createProxyMiddleware({
  target: "http://localhost:3002",
  changeOrigin: true
}));

app.use("/card", createProxyMiddleware({
  target: "http://localhost:3003",
  changeOrigin: true,
  pathRewrite:{
    "^/card":"/card"
  }
}));


app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});
