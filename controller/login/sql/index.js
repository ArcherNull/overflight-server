/*
 * @Author: Null
 * @Date: 2022-10-24 11:59:24
 * @Description: SQL
 */
module.exports = {
    QUERY: "select * from `user`",
    QUERY_USER_BY_USERNAME: "SELECT * FROM `user` WHERE username=",
    QUERY_USER_BY_ID: "SELECT * FROM `user` WHERE id=",
    DELETE_USER_BY_ID: "DELETE FROM `user` WHERE id=",
    INSERT_USER: "insert into user (username, password) values (?,?)",
}