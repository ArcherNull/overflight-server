/*
 * @Author: Null
 * @Date: 2022-10-22 17:32:47
 * @Description:
 */
const login = require("./login/index");
const compress = require("./compress/index");
const upload = require("./upload/index");
const user = require("./user/index");

module.exports = {
  authApi: {
    user,
    upload,
    compress
  },
  noAuthApi: {
    login,
  },
};
