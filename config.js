/*
 * @Author: Null
 * @Date: 2022-10-22 17:28:03
 * @Description：配置文件
 */

const { name, version } = require("./package.json");

let CONFIG = {
  NAME: name,
  VERSION: version,
  PORT: 8832,
  TOKEN_PREFIX: "/api",
  NO_TOKEN_PREFIX: "/admin",
  TOKEN_SECRET_KEY: "tokenSecretKey", // token生成密钥
  TOKEN_DEAD_TIME: "7 days", // token失效时间 30s
  TOKEN_JWT_ALGORITHM: "RS256", // HS256
  TOKEN_EXPRESS_JWT_ALGORITHM: ["HS256"], // RS256
  PAGE_SIZE: 10, // 每页条数
  CURRENT_PAGE: 1, // 默认第一页

  BASE_URL: "http://localhost", // 域名
  ASSETS_ROOT_PATH: "/public", // 静态资源根路径
  UPLOAD_IMAGE_PATH: "/public/assets/images", // 上传图片路径
  UPLOAD_EXCEL_PATH: "/public/excel", // 上传excel路径
  UPLOAD_ZIP_PATH: "/public/zip", // 上传zip路径
  ZIP_FILENAME_ENCODING: "gbk", // zip解码格式， gbk 一个汉字编码标准
  UPLOAD_LIMITS: 5, // 文件上传最大数量

  REQ_LIMIT_SIZE: "10mb", // req对象上传输数据限制在 10M 内

  INIT_USERNAME: "admin",
  INIT_PASSWORD: "12345",
};

module.exports = CONFIG;
