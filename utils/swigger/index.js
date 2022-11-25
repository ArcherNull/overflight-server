/*
 * @Author: Null
 * @Date: 2022-10-24 08:58:09
 * @Description: swagger 测试文档中间件
 */
const path = require("path");
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "测试api",
      version: "1.0.0",
      description: `测试共用接口api`,
    },
  },
  apis: [path.join(__dirname, "../../routes/**/*.js")],
};

var swaggerJson = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
};
const swaggerSpec = swaggerDoc(options);

var swaggerInstall = function (app) {
  if (!app) {
    app = express();
  }
  // 开放相关接口，
  app.get("/swagger.json", swaggerJson);
  // 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由
  app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};
module.exports = swaggerInstall;
