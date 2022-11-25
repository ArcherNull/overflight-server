/*
 * @Author: Null
 * @Date: 2022-11-03 09:34:50
 * @Description: 转码
 */
const iconv = require("iconv-lite");
const str = Buffer(iconv.encode(str, "gbk")).toString("base64");


