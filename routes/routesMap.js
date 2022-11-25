/*
 * @Author: Null
 * @Date: 2022-10-22 17:32:56
 * @Description: 路由映射文件
 */
const { isEmpty } = require("lodash");
const { TOKEN_PREFIX, NO_TOKEN_PREFIX } = require("../config");
const { authApi, noAuthApi } = require("./index");

 exports.generateRoutes = (app) => {
  if (!isEmpty(authApi)) {
    Object.values(authApi).forEach((ele) => {
      app.use(`${TOKEN_PREFIX}`, ele);
    });
  }
  if (!isEmpty(noAuthApi)) {
    Object.values(noAuthApi).forEach((ele) => {
      app.use(`${NO_TOKEN_PREFIX}`, ele);
    });
  }
};
