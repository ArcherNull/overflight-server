const { isObject, isEmpty } = require("lodash");

/**
 * @description: 检查必填字段值是否为空
 * @param {*} fieldsObj
 * @return {*}
 */
exports.checkFieldsIsEmpty = (fieldsObj, data) => {
  let errorLog = [];
  if (isObject(fieldsObj) && !isEmpty(fieldsObj)) {
    const fieldsObjArr = Object.entries(fieldsObj);
    fieldsObjArr.forEach((ele) => {
      if (!data[ele[0]]) {
        errorLog.push(`${ele[0]}必传字段不能为空`);
      }
    });
  } else {
    errorLog.push("传参类型不能为空数组");
  }
  return errorLog;
};
