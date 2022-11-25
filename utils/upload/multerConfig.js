/*
 * @Author: Null
 * @Date: 2022-10-27 11:52:46
 * @Description:
 */
// 1. 引入依赖
const multer = require("multer");
const md5 = require("md5");
const { UPLOAD_IMAGE_PATH } = require("../../config");

// 2. 引入工具
const path = require("path");

// 3. multer的配置对象
let storage = multer.diskStorage({
  // 3.1 存储路径
  destination: function (req, file, cb) {
    const mimetypeArr = ["image/jpeg", "image/png", "image/jpg"];
    // 3.1.1 允许图片上传
    if (mimetypeArr.includes(file.mimetype)) {
      const url = path.join(__dirname, "../../", UPLOAD_IMAGE_PATH);
      cb(null, url);
    } else {
      // 3.1.2 限制其他文件上传类型
      cb({ error: `上传的文件类型不满足${mimetypeArr.join(",")}格式` });
    }
  },
  //  3.2 存储名称
  filename: function (req, file, cb) {
    const { originalname } = file;
    // const filename = md5(new Date()) + "-" + originalname;
    const filename = md5(new Date()) + "-" + originalname;

    cb(null, filename);
  },
});

// 4. 添加配置
const uploadFile = multer({
  storage: storage,
});

// 5. 导出配置好的multerConfig
module.exports = uploadFile;
