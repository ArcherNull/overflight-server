/*
 * @Author: Null
 * @Date: 2022-10-27 11:52:46
 * @Descriptexporexpor
 */
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// 1. 引入配置好的multerConfig
const uploadFile = require("./multerConfig");
const {
  PORT,
  UPLOAD_IMAGE_PATH,
  BASE_URL,
  UPLOAD_LIMITS,
} = require("../../config");
const { isEmpty } = require("lodash");

// 2. 定义静态变量
const fileName = "file"; // 上传的 fileName 名称
const updateBaseUrl = `${BASE_URL}:${PORT}`; // 上传到服务器地址

// 上传接口的 请求参数req  响应参数res
exports.upload = (req, res) => {
  return new Promise((resolve, reject) => {
    uploadFile.single(fileName)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log("multer.MulterError发生错误", err);
        reject(err);
      } else if (err) {
        reject(err);
      } else {
        const url = updateBaseUrl + UPLOAD_IMAGE_PATH + "/" + req.file.filename;
        const shortUrl = UPLOAD_IMAGE_PATH + "/" + req.file.filename;
        // `req.file.filename`  请求文件名称后缀
        // `updateBaseUrl + imgPath + req.file.filename` 完整的服务器虚拟目录
        resolve({
          url,
          shortUrl,
        });
      }
    });
  });
};

// 上传接口的 请求参数req  响应参数res
exports.multiUpload = (req, res) => {
  console.log("上传接口的multiUpload");
  return new Promise((resolve, reject) => {
    uploadFile.array(fileName, UPLOAD_LIMITS)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log("multer.MulterError发生错误", err);
        reject(err);
      } else if (err) {
        console.log("发生错误", err);
        reject(err);
      } else {
        if (!isEmpty(req.files)) {
          const fileData = req.files.map((ele) => {
            const url = updateBaseUrl + UPLOAD_IMAGE_PATH + "/" + ele.filename;
            const shortUrl = UPLOAD_IMAGE_PATH + "/" + ele.filename;
            return {
              url,
              shortUrl,
            };
          });

          resolve(fileData);
        } else {
          reject("多文件上传失败");
        }
      }
    });
  });
};

// 删除文件
exports.delFile = (req, res) => {
  console.log("删除文件", req.body);
  return new Promise((resolve, reject) => {
    const { fileUrl } = req.body;
    console.log("fileUrl=====>", fileUrl);
    if (fileUrl) {
      try {
        const url = path.join(__dirname, "../../", fileUrl);
        fs.unlink(url, function (error) {
          if (error) {
            reject("删除文件失败", error);
          } else {
            resolve("删除文件成功");
          }
        });
      } catch (error) {
        console.log("error=====>", error);
        reject("删除文件失败");
      }
    } else {
      reject("未获取到要删除的文件路径");
    }
  });
};
