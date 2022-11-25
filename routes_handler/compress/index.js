/*
 * @Author: Null
 * @Date: 2022-10-27 10:54:34
 * @Description: 上传文件
 */
const {
  unCompressFile,
  compressFile,
  compressMultiFile,
} = require("../../utils/zip/index");
const { SuccessModel, ErrorModel } = require("../../model/index");

/**
 * @description: 压缩单个文件
 * @return {*}
 */
exports.compressFile = (req, res) => {
  compressFile(req.body)
    .then((resData) => {
      res.send(new SuccessModel(resData));
    })
    .catch((error) => {
      res.send(new ErrorModel(error || "压缩失败"));
    });
};

/**
 * @description: 压缩单个文件
 * @return {*}
 */
exports.compressMultiFile = (req, res) => {
  compressMultiFile(req.body)
    .then((resData) => {
      res.send(new SuccessModel(resData));
    })
    .catch((error) => {
      console.log('error123',error)
      res.send(new ErrorModel(error || "压缩失败"));
    });
};

/**
 * @description: 解压单个文件
 * @return {*}
 */
exports.unCompressFile = (req, res) => {
  unCompressFile(req.body)
    .then((resData) => {
      res.send(new SuccessModel(resData));
    })
    .catch((error) => {
      res.send(new ErrorModel(error || "解压失败"));
    });
};
