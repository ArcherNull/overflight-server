/*
 * @Author: Null
 * @Date: 2022-10-27 10:54:34
 * @Description: 上传文件
 */
const { upload, delFile, multiUpload } = require("../../utils/upload/index");
const { SuccessModel, ErrorModel } = require("../../model/index");

/**
 * @description: 上传单个文件
 * @return {*}
 */
exports.upload = (req, res) => {
  upload(req, res)
    .then((imgSrc) => {
      console.log("imgSrc=====>", imgSrc);
      res.send(
        new SuccessModel(
          {
            data: imgSrc,
          },
          "上传成功"
        )
      );
    })
    .catch((error) => {
      console.log("error=====>", error);
      res.send(new ErrorModel(error || "上传失败"));
    });
};

/**
 * @description: 上传单个文件
 * @return {*}
 */
 exports.multiUpload = (req, res) => {
  multiUpload(req, res)
    .then((imgSrc) => {
      console.log("imgSrc=====>", imgSrc);
      res.send(
        new SuccessModel(
          {
            data: imgSrc,
          },
          "上传成功"
        )
      );
    })
    .catch((error) => {
      console.log("error=====>", error);
      res.send(new ErrorModel(error || "上传失败"));
    });
};

/**
 * @description: 删除单个文件
 * @return {*}
 */
exports.delFile = (req, res) => {
  delFile(req)
    .then((resData) => {
      res.send(new SuccessModel(resData));
    })
    .catch((error) => {
      res.send(new ErrorModel(error || "删除失败"));
    });
};
