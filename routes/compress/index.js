/*
 * @Author: Null
 * @Date: 2022-10-27 10:54:09
 * @Description: 上传文件
 */

const express = require("express");
const router = express.Router();
const {
  compressFile,
  unCompressFile,
  compressMultiFile,
} = require("../../routes_handler/compress/index");

/**,
 * @swagger
 * /api/compressFile:
 *    post:
 *      tags:
 *      - 压缩文件
 *      summary: 压缩文件
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
router.post("/compressFile", compressFile);

/**,
 * @swagger
 * /api/compressMultiFile:
 *    post:
 *      tags:
 *      - 压缩多个文件
 *      summary: 压缩多个文件
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
router.post("/compressMultiFile", compressMultiFile);

/**,
 * @swagger
 * /api/unCompressFile:
 *    post:
 *      tags:
 *      - 解压文件
 *      summary: 解压文件
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
router.post("/unCompressFile", unCompressFile);

module.exports = router;
