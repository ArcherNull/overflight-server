/*
 * @Author: Null
 * @Date: 2022-10-24 11:59:17
 * @Description: 登录处理
 */
const db = require("../../database/index");
const { QUERY_USER_BY_USERNAME, INSERT_USER } = require("./sql/index");
const { jwt } = require("../../utils/jwt/index");

/**
 * @description: 查询用户是否存在
 * @param {*} userData 传递参数
 * @param {*} type 请求类型
 * @return {*}
 */
exports.queryUserIsExist = (userData, type = "login") => {
  return new Promise((resolve, reject) => {
    const { username, password } = userData;
    if (username && password) {
      const sqlStr = `${QUERY_USER_BY_USERNAME}'${username}'`;
      db.query(sqlStr, (error, results) => {
        if (error) {
          reject("数据库查询失败:" + error.message);
        } else {
          if (type === "login") {
            if (results.length) {
              const user = results[0];
              if (user.password === password) {
                const token = jwt({ username });
                if (token) {
                  resolve({
                    token,
                    userInfo: results[0],
                  });
                } else {
                  reject("token生成失败！");
                }
              } else {
                reject("输入的密码错误！");
              }
            } else {
              reject("登录的账号和密码不正确，请检查！");
            }
          } else if (type === "register") {
            if (results.length) {
              reject("此账号已被注册");
            } else {
              resolve(userData);
            }
          }
        }
      });
    } else {
      reject("用户名和密码不能为空");
    }
  });
};

/**
 * @description:
 * @param {*} userData
 * @return {*}
 */
exports.insertUserToDb = function (userData) {
  return new Promise((resolve, reject) => {
    const { username, password } = userData;
    if (username && password) {
      const sqlStr = INSERT_USER;
      db.query(sqlStr, [username, password], (error, results) => {
        if (error) {
          console.log("数据库查询失败", error);
          reject("数据库查询失败:" + error.message);
        } else {
          if (results.affectedRows === 1) {
            resolve("注册成功");
          } else {
            reject("注册失败");
          }
        }
      });
    } else {
      reject("用户名和密码不能为空");
    }
  });
};
