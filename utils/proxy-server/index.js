/*
 * @Author: Null
 * @Date: 2022-11-04 10:35:41
 * @Description: 代理服务器
 */

var proxy = require("http-proxy-middleware");

exports.proxyServer = (app) => {
  app.use(
    "/proxy",
    proxy.createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: false,
      pathRewrite: {
        "^/proxy": "",
      },
    })
  );
};
