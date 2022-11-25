/*
 * @Author: Null
 * @Date: 2022-10-24 11:59:48
 * @Description: 用户接口
 */
const { isEmpty } = require("lodash");
const db = require("../../database/index");
const { PAGE_SIZE, CURRENT_PAGE } = require("../../config");
const { checkFieldsIsEmpty } = require("../../common/index");

const {
  generateQuerySql,
  generateWhereSql,
  generateUpdateSql,
  generateDeleteSql
} = require("../../database/sql");
const { QUERY_USER_BY_PHONE } = require("./sql/index");

/**
 * @description: 查询用户列表
 * @param {*} userData
 * @param {*} type
 * @return {*}
 */
exports.queryUerList = (userData, type = "list") => {
  return new Promise(async (resolve, reject) => {
    const queryData = Object.assign(
      {
        orderBy: "gender:desc",
        currentPage: CURRENT_PAGE,
        pageSize: PAGE_SIZE,
      },
      userData
    );
    const querySql = await generateQuerySql("user");
    const tableCount = await generateQuerySql("user", "count");
    const whereSql = await generateWhereSql(queryData);
    const querySqlStr = `${querySql} ${whereSql}`;
    const countSqlStr = `${tableCount} ${whereSql}`;

    const sqlStr = `${countSqlStr};${querySqlStr}`;
    console.log("sqlStr=====>", sqlStr);

    db.query(sqlStr, (error, results) => {
      if (error) {
        reject("数据库查询失败:" + error.message);
      } else {
        if (type === "list") {
          const total = results[0][0]["count(*)"];
          const data = {
            total,
            currentPage: queryData.currentPage,
            pageSize: queryData.pageSize,
            data: results[1],
          };
          // console.log('data=====>',data)
          resolve(data);
        } else {
        }
      }
    });
  });
};

/**
 * @description: 查询用户数据是否存在
 * @param {*} userData
 * @return {*}
 */
exports.queryUserDataIsExist = function (userData) {
  return new Promise((resolve, reject) => {
    const { phone } = userData;
    const sqlStr = `${QUERY_USER_BY_PHONE}'${phone}'`;
    db.query(sqlStr, (error, results) => {
      if (error) {
        reject("数据库查询失败:" + error.message);
      } else {
        if (results.length) {
          reject("此手机号已被注册了");
        } else {
          resolve(userData);
        }
      }
    });
    if (phone) {
    } else {
      reject("手机号是必填项");
    }
  });
};

/**
 * @description:
 * @param {*} userData
 * @return {*}
 */
exports.updateUserData = function (userData) {
  return new Promise(async (resolve, reject) => {
    const { id, name, gender, addr, phone, remark } = userData;
    const errorLog = checkFieldsIsEmpty(
      {
        id: "用户id",
        name: "真实姓名",
        gender: "性别",
        addr: "地址",
        phone: "手机号",
      },
      userData
    );

    if (isEmpty(errorLog)) {
      const sqlStr = await generateUpdateSql("user", id, {
        name,
        gender,
        addr,
        phone,
        remark,
      });

      console.log("sqlStr", sqlStr);

      db.query(sqlStr, (error, results) => {
        if (error) {
          console.log("数据库查询失败", error);
          reject("数据库查询失败:" + error.message);
        } else {
          if (results.affectedRows === 1) {
            resolve("编辑成功");
          } else {
            reject("编辑失败");
          }
        }
      });
    } else {
      reject(errorLog.join(","));
    }
  });
};

/**
 * @description:
 * @param {*} userData
 * @return {*}
 */
 exports.deleteUserData = function (userData) {
  return new Promise(async (resolve, reject) => {
    const { id } = userData;
    const errorLog = checkFieldsIsEmpty(
      {
        id: "用户id"
      },
      userData
    );

    if (isEmpty(errorLog)) {
      const sqlStr = await generateDeleteSql("user", id);

      db.query(sqlStr, (error, results) => {
        if (error) {
          reject("数据库查询失败:" + error.message);
        } else {
          if (results.affectedRows === 1) {
            resolve("删除成功");
          } else {
            reject("删除失败");
          }
        }
      });
    } else {
      reject(errorLog.join(","));
    }
  });
};
