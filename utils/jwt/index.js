/*
 * @Author: Null
 * @Date: 2022-10-24 14:17:56
 * @Description:
 */
const { isObject } = require('lodash')
const { expressjwt } = require("express-jwt");
const jwt = require("jsonwebtoken");
const {
  TOKEN_SECRET_KEY,
  TOKEN_EXPRESS_JWT_ALGORITHM,
  TOKEN_DEAD_TIME,
  NO_TOKEN_PREFIX,
  ASSETS_ROOT_PATH
} = require("../../config");

exports.expressjwt = function (app) {
  const regStr = new RegExp("^\\" + NO_TOKEN_PREFIX + '|\\' +  ASSETS_ROOT_PATH);
  app.use(
    expressjwt({
      secret: TOKEN_SECRET_KEY,
      algorithms: TOKEN_EXPRESS_JWT_ALGORITHM,
    }).unless({
      //   path: [/^\/admin/],
      path: [regStr],
    })
  );
};

exports.jwt = function (data) {
  let tokenStr = "";
  if (isObject(data)) {
    tokenStr =
      "Bearer " +
      jwt.sign(data, TOKEN_SECRET_KEY, {
        expiresIn: TOKEN_DEAD_TIME,
      });
  } else {
    console.log("生成token需要传入data");
  }
  console.log("tokenStr=====>", tokenStr);
  return tokenStr;
};
