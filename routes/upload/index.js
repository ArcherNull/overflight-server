/*
 * @Author: Null
 * @Date: 2022-10-27 10:54:09
 * @Description: 上传文件
 */

const express = require("express");
const router = express.Router();
const {
  upload,
  delFile,
  multiUpload,
} = require("../../routes_handler/upload/index");

/**,
 * @swagger
 * /api/upload:
 *    post:
 *      tags:
 *      - 上传文件
 *      summary: 上传文件
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
router.post("/upload", upload);

/**,
 * @swagger
 * /api/multiUpload:
 *    post:
 *      tags:
 *      - 上传多文件
 *      summary: 上传多文件
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
router.post("/multiUpload", multiUpload);

/**,
 * @swagger
 * /api/delFile:
 *    post:
 *      tags:
 *      - 删除文件
 *      summary: 删除文件
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: fileUrl
 *        in: query
 *        description: 删除文件的路径
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
router.post("/delFile", delFile);

module.exports = router;
