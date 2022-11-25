/*
 * @Author: Null
 * @Date: 2022-10-25 14:21:33
 * @Description: sql 优先级 条件语句 > 排序语句 > 分页
 */
const { isEmpty, isObject, isArray, isString } = require("lodash");
const { PAGE_SIZE, CURRENT_PAGE } = require("../config");
/**
 * @description: 解析模糊搜索字符串并生成sql语句
 * @param {*} str
 * @return {*}
 */
const parseLikeStrAndGetSql = function (str, type = "and") {
  return new Promise((resolve, reject) => {
    parseFieldStr(str)
      .then((res) => {
        return likeFieldSql(res, type);
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log("error=====>", error);
        reject("模糊搜索sql解析失败," + error);
      });
  });
};

/**
 * @description: 解析模糊搜索值
 * @param {String} str
 * @return {*}
 */
const parseFieldStr = function (str) {
  return new Promise((resolve, reject) => {
    if (isString(str)) {
      const splitArr = str.split(":");
      if (splitArr.length === 2) {
        if (splitArr[1]) {
          if (splitArr[0]) {
            const fieldArr = splitArr[0].split(",");
            let obj = {};
            fieldArr.forEach((ele) => {
              obj[ele] = splitArr[1];
            });

            console.log("obj", obj);
            resolve(obj);
          } else {
            reject("模糊搜索不存在自定义搜索字段");
          }
        } else {
          reject("模糊搜索未填写搜索值");
        }
      } else {
        reject("解析模糊搜索sql,不存在特殊标识符:");
      }
    } else {
      reject("解析模糊搜索sql,传入类型只允许为字符串");
    }
  });
};

/**
 * @description: 解析排序字符串
 * @param {String} str
 * @return {*}
 */
const parseOrderByStr = function (str) {
  return new Promise((resolve, reject) => {
    if (isString(str)) {
      const splitArr = str.split(",");
      if (splitArr.length) {
        let orderByObj = {};
        const orderByArr = ["asc", "desc"];
        splitArr.forEach((ele) => {
          const arr = ele.split(":");
          if (arr.length === 2) {
            const [key, value] = arr;
            if (key) {
              orderByObj[key] = orderByArr.includes(value) ? value : "asc";
            }
          }
        });
        resolve(orderByObj);
      } else {
        reject("解析模糊搜索sql,不存在特殊标识符:");
      }
    } else {
      reject("解析排序sql,传入类型只允许为字符串");
    }
  });
};

/**
 * @description: 生成模糊搜索sql语句
 * @param {Object} data 搜索参数
 * @param {String} type 连接类型 and | or
 * @return {*}
 */
const likeFieldSql = function (data, type = "or") {
  return new Promise((resolve, reject) => {
    if (isObject(data)) {
      if (!isEmpty(data)) {
        const typeArr = ["and", "or"];
        const likeFieldArr = Object.entries(data);
        let sqlStrArr = likeFieldArr.map((ele) => {
          return ` ${ele[0]} like '%${ele[1]}%' `;
        });
        let joinType = "or";
        if (typeArr.includes(type)) {
          joinType = type;
        }
        let sqlStr = sqlStrArr.join(joinType);
        console.log("sqlStr=====>", sqlStr);
        resolve(sqlStr);
      } else {
        reject("不能为空对象");
      }
    } else {
      reject("传参类型为对象");
    }
  });
};

/**
 * @description: 排序sql写法
 * @param {String[]} orderByObj
 * @param {String} type asc / desc
 * @return {*}
 */
const getOrderBySql = function (orderByObj) {
  return new Promise((resolve, reject) => {
    if (isObject(orderByObj)) {
      if (!isEmpty(orderByObj)) {
        const orderByStr = ["asc", "desc"];
        const orderByArr = Object.entries(orderByObj);

        let sqlStrArr = orderByArr.map((ele) => {
          const [key, value] = ele;
          console.log("ele=====>", ele);
          if (orderByStr.includes(value)) {
            return `${key} ${value}`;
          } else {
            return `${key} asc`;
          }
        });

        let sqlStr = " order by " + sqlStrArr.join(",");
        console.log("getOrderBySql=====>", sqlStr);
        resolve(sqlStr);
      } else {
        reject("不能为空对象");
      }
    } else {
      reject("传参类型为对象");
    }
  });
};

/**
 * @description: 查询表sql
 * @param {String} table 表名
 * @param {String[]} columns 表字段
 * @param {String} type 类型 query / count
 * @return {*}
 */
const generateQuerySql = function (table, type = "query", columns = []) {
  return new Promise((resolve, reject) => {
    if (table) {
      if (isArray(columns)) {
        let fields = "";
        if (type === "count") {
          fields = columns.length ? `count(${columns.join(",")})` : "count(*)";
        } else {
          fields = columns.length ? columns.join(",") : "*";
        }
        const queryStr = `select ${fields} from ${table}`;
        console.log("queryStr=====>", queryStr);
        resolve(queryStr);
      } else {
        reject("表字段入参类型为数组");
      }
    } else {
      reject("表名是必填项,sql生成失败");
    }
  });
};

/**
 * @description: 生成sql语句
 * @param {Object} data 请求参数
 * @param {Object} config 生成sql语句的配置
 * @return {*}
 */
const generateWhereSql = function (data, config = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const { currentPage, pageSize, likeField, orderBy } = data;
      const defaultConfig = {
        likeField: config?.likeField || "or",
      };
      let sqlStr = "";
      // 模糊搜索
      if (likeField) {
        const likeFieldSql = await parseLikeStrAndGetSql(
          likeField,
          defaultConfig.likeField
        );
        console.log("likeFieldSql=====>", likeFieldSql);
        sqlStr += `where ${likeFieldSql}`;
      }

      // 排序
      if (orderBy) {
        const orderByObj = await parseOrderByStr(orderBy);
        const orderBySql = await getOrderBySql(orderByObj);
        sqlStr += orderBySql;
      }

      // 分页
      let cPage = currentPage
        ? currentPage > 0
          ? currentPage
          : CURRENT_PAGE
        : CURRENT_PAGE;
      let pSize = pageSize ? (pageSize > 0 ? pageSize : PAGE_SIZE) : PAGE_SIZE;

      const startIndex = (cPage - 1) * pSize;
      const endIndex = cPage * pSize;
      const pageStr = ` limit ${startIndex},${endIndex}`;

      sqlStr += pageStr;

      console.log("sqlStr=====>", sqlStr);

      resolve(sqlStr);
    } catch (error) {
      console.log("error=====>", error);
      reject("sql生成错误", error);
    }
  });
};

const getTableCount = function (data, config) {
  return new Promise(async (resolve, reject) => {
    try {
      const { likeField } = data;
      const defaultConfig = {
        likeField: config?.likeField || "or",
      };
      let sqlStr = "";

      // 模糊搜索
      if (likeField) {
        const likeFieldSql = await parseLikeStrAndGetSql(
          likeField,
          defaultConfig.likeField
        );
        console.log("likeFieldSql=====>", likeFieldSql);
        sqlStr += likeFieldSql;
      }

      console.log("sqlStr", sqlStr);
    } catch (error) {
      console.log("error=====>", error);
      reject("sql生成错误", error);
    }
  });
};

/**
 * @description: 设置某表中id确定的数据
 * @param {*} table
 * @param {*} id
 * @param {*} setObj
 * @return {*}
 */
const generateUpdateSql = function (table, id, setObj) {
  return new Promise((resolve, reject) => {
    if (table) {
      if (id) {
        if (isObject(setObj) && !isEmpty(setObj)) {
          const setArr = Object.entries(setObj)
            .map((ele) => {
              return `${ele[0]}='${ele[1]}'`;
            })
            .join(",");

          const sqlStr = `update ${table} set ${setArr} where id=${id}`;
          resolve(sqlStr);
        } else {
          reject("设置字段需为对象，并且不能为空对象");
        }
      } else {
        reject("id是必填项");
      }
    } else {
      reject("表名是必填项");
    }
  });
};

/**
 * @description: 生成删除sql
 * @param {*} table
 * @param {*} id
 * @return {*}
 */
const generateDeleteSql = function (table, id) {
  return new Promise((resolve, reject) => {
    if (table) {
      if (id) {
        const sqlStr = `delete from ${table} where id=${id}`;
        resolve(sqlStr)
      } else {
        reject("id是必填项");
      }
    } else {
      reject("表名是必填项");
    }
  });
};

module.exports = {
  parseLikeStrAndGetSql,
  parseFieldStr,
  likeFieldSql,
  getOrderBySql,
  generateWhereSql,
  generateQuerySql,
  getTableCount,
  generateUpdateSql,
  generateDeleteSql
};
