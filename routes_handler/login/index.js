/*
 * @Author: Null
 * @Date: 2022-10-22 17:56:53
 * @Description: 登录处理
 */
const {
  queryUserIsExist,
  insertUserToDb,
} = require("../../controller/login/index");
const { SuccessModel, ErrorModel } = require("../../model/index");

/**
 * @description: 登录接口
 * @return {*}
 */
exports.login = (req, res) => {
  const userData = req.body;
  queryUserIsExist(userData, "login")
    .then((response) => {
      return res.send(new SuccessModel(response));
    })
    .catch((error) => {
      return res.send(new ErrorModel(error || "操作失败"));
    });
};

/**
 * @description: 注册接口处理
 * @return {*}
 */
exports.register = (req, res) => {
  const userData = req.body;
  queryUserIsExist(userData, "register")
    .then((response) => {
      return insertUserToDb(response);
    })
    .then((response) => {
      return res.send(new SuccessModel(response));
    })
    .catch((error) => {
      return res.send(new ErrorModel(error || "操作失败"));
    });
  res.send("注册接口处理-请求成功");
};
