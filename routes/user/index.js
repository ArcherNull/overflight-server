/*
 * @Author: Null
 * @Date: 2022-10-22 17:56:20
 * @Description: 用户接口
 */
const express = require("express");
const router = express.Router();
const { list, add, edit, del, exportExcel } = require("../../routes_handler/user/index");

/**,
 * @swagger
 * /api/user/list:
 *    post:
 *      tags:
 *      - 用户管理
 *      summary: 获取用户列表
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: likeField
 *        in: query
 *        description: 模糊搜索【姓名/电话】
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
router.post("/user/list", list);

/**,
 * @swagger
 * /api/user/add:
 *    get:
 *      tags:
 *      - 用户管理
 *      summary: 新增用户
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: likeField
 *        in: query
 *        description: 模糊搜索【姓名/电话】
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
router.post("/user/add", add);

/**,
 * @swagger
 * /api/user/edit:
 *    get:
 *      tags:
 *      - 用户管理
 *      summary: 编辑用户
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: likeField
 *        in: query
 *        description: 模糊搜索【姓名/电话】
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
router.post("/user/edit", edit);

/**,
 * @swagger
 * /api/user/delete:
 *    get:
 *      tags:
 *      - 用户管理
 *      summary: 删除用户
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: likeField
 *        in: query
 *        description: 模糊搜索【姓名/电话】
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
router.post("/user/delete", del);

/**,
 * @swagger
 * /api/user/excel:
 *    get:
 *      tags:
 *      - 用户数据excel导出
 *      summary: 删除用户
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: likeField
 *        in: query
 *        description: 模糊搜索【姓名/电话】
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
 router.post("/user/excel", exportExcel);

module.exports = router;
