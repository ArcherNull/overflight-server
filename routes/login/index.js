/*
 * @Author: Null
 * @Date: 2022-10-22 17:56:16
 * @Description: 登录接口
 */
const express = require("express");
const router = express.Router();
const { login, register } = require("../../routes_handler/login/index");

/**,
 * @swagger
 * /api/addExam:
 *    post:
 *      tags:
 *      - 测试
 *      summary: 提交考试答案
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: name
 *        in: query
 *        description: 姓名
 *        required: false
 *        type: integer
 *        maximum:
 *        minimum: 1
 *        format:
 *      - name: phone
 *        in: query
 *        description: 电话
 *        required: false
 *        type: integer
 *        maximum:
 *        minimum: 1
 *        format:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/definitions/Order
 *        400:
 *          description: Invalid ID supplied
 *        404:
 *          description: Order not found
 * */
router.post("/login", login);



router.post("/register", register);

module.exports = router;
