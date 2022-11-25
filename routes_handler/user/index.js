/*
 * @Author: Null
 * @Date: 2022-10-24 11:59:48
 * @Description: 用户接口
 */

const {
  queryUerList,
  updateUserData,
  queryUserDataIsExist,
  deleteUserData,
} = require("../../controller/user/index");

const {
  SuccessModel,
  ErrorModel,
  SuccessPageModel,
} = require("../../model/index");

const {
  filterData,
  getBuffer,
  generateExcelSheet,
} = require("../../utils/excel/xlsx-style");

// 用户列表接口
exports.list = (req, res) => {
  queryUerList(req.body, "list")
    .then((response) => {
      res.send(new SuccessPageModel(response));
    })
    .catch((error) => {
      res.send(new ErrorModel(error || "请求失败"));
    });
};

// 添加用户接口
exports.add = (req, res) => {
  queryUserDataIsExist(req.body)
    .then((response) => {
      return updateUserData(response);
    })
    .then((response) => {
      res.send(new SuccessModel(response));
    })
    .catch((error) => {
      res.send(new ErrorModel(error || "请求失败"));
    });
};

// 编辑
exports.edit = (req, res) => {
  queryUserDataIsExist(req.body)
    .then((response) => {
      return updateUserData(response);
    })
    .then((response) => {
      res.send(new SuccessModel(response));
    })
    .catch((error) => {
      res.send(new ErrorModel(error || "请求失败"));
    });
};

// 删除
exports.del = (req, res) => {
  deleteUserData(req.body)
    .then((response) => {
      res.send(new SuccessModel(response));
    })
    .catch((error) => {
      res.send(new ErrorModel(error || "请求失败"));
    });
};

// excel导出
exports.exportExcel = (req, res) => {
  const reqData = {
    pageSize: 500,
    ...req.body,
  };
  queryUerList(reqData, "list")
    .then((response) => {
      console.log("response=====>", response);
      const { data } = response;
      const filterObj = {
        name: "姓名",
        gender: "性别",
        addr: "地址",
        username: "用户名",
        password: "密码",
        phone: "电话号码",
        remark: "备注",
      };

      const excelData = filterData(filterObj, data);
      return generateExcelSheet("用户列表", getBuffer(excelData));
    })
    .then((response) => {
      res.send(new SuccessModel(response));
    })
    .catch((error) => {
      res.send(new ErrorModel(error || "请求失败"));
    });
};
