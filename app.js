/*
 * @Author: Null
 * @Date: 2022-10-22 17:27:57
 * @Description: 服务入口文件
 */
const express = require("express");
const path = require("path");
const cors = require("cors");
const createError = require("http-errors");
const app = express();
const logger = require("morgan");
const { generateRoutes } = require("./routes/routesMap");
const { expressjwt } = require("./utils/jwt/index");
const { ASSETS_ROOT_PATH, REQ_LIMIT_SIZE } = require("./config");
const { proxyServer } = require("./utils/proxy-server/index");

// swagger 自动接口文档生成
const swaggerInstall = require("./utils/swigger");
swaggerInstall(app);

// 设置模板引擎【这里如果不需要，可以不设置】
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: REQ_LIMIT_SIZE }));
app.use(express.urlencoded({ limit: REQ_LIMIT_SIZE, extended: false }));
app.use(ASSETS_ROOT_PATH, express.static(path.join(__dirname, "public")));
// jwt
expressjwt(app);

// 设置请求头
// app.all('*', async function (req, res, next) {
//   res.header('Content-Type','text/html; charset=utf-8');
//   next();
// });

// 代理
proxyServer(app);

// 生成路由  【注意：路由要放置于前置中间件和错误中间件的中间】
generateRoutes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
