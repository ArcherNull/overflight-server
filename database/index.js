/*
 * @Author: Null
 * @Date: 2022-10-22 17:53:47
 * @Description: 
 */
const mysql = require('mysql')
const MYSQL_CONFIG = require('./config')
const db = mysql.createPool(MYSQL_CONFIG)

module.exports = db