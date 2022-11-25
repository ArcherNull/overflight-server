/*
 * @Author: Null
 * @Date: 2022-10-24 12:00:04
 * @Description: mysql配置
 */
let MYSQL_CONFIG = {
  host:'localhost',
  user:'root',
  password:'chenRoot12345',
  database:'nodejs',
  multipleStatements: true, // 开启多sql语句执行
  connectTimeout:5000
};

module.exports = MYSQL_CONFIG