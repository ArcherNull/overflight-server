/*
 * @Author: Null
 * @Date: 2022-11-01 10:03:49
 * @Description: 可以通过xlsx-style对excel表格设置样式，跟node-xlsx的基础上多了一些东西
 * 参考文档：https://juejin.cn/post/6903820868859002888
 */

//生成Excel依赖包
const xlsx = require("xlsx-style");
const { isObject, isEmpty, reject } = require("lodash");
const md5 = require("md5");
const { parseFile } = require("../fs/index");
const { UPLOAD_EXCEL_PATH, PORT, BASE_URL } = require("../../config");
const path = require("path");

/**
 * @description: 生成文件路径
 * @param {*} filename 文件名
 * @return {*}
 */
function getFilePath(filename, ext = ".xlsx") {
  const shortPath = `${UPLOAD_EXCEL_PATH}/${filename}${ext}`;
  const fullPath = path.join(__dirname, "../../", shortPath);
  return {
    fullPath,
    shortPath,
  };
}

/**
 * @description: 生成excel文件
 * @param {*} excelFileName excel文件名
 * @param {*} excelData excelData
 * const list = [
  {
    name: "sheet1",
    data: [
      ["data1", "data2", "data3"],
      ["data1", "data2", "data3"],
      ["data1", "data2", "data3"],
    ],
  },  
  {
    name: "sheet2",
    data: [
      ["data1", "data2", "data3"],
      ["data1", "data2", "data3"],
      ["data1", "data2", "data3"],
    ],
  },
];
 * @return {*}
 */
function generateExcelSheet(excelFileName, excelData) {
  return new Promise((resolve, reject) => {
    const fileName = md5(new Date()) + "-" + excelFileName;
    const { fullPath, shortPath } = getFilePath(fileName, ".xlsx");

    const updateBaseUrl = `${BASE_URL}:${PORT}`; // 上传到服务器地址
    const url = updateBaseUrl + shortPath;
    const shortUrl = shortPath;
    console.log("excelData====>", excelData);

    parseFile(fullPath, excelData)
      .then(() => {
        resolve({
          url,
          shortUrl,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * @description:  参考文档：https://blog.csdn.net/weixin_46108101/article/details/122342566
 * @param {*} data
 * 传入数据示例
 * const list = [
  {
    name: "sheet",
    data: [
      ["data1", "data2", "data3"],
      ["data1", "data2", "data3"],
      ["data1", "data2", "data3"],
    ],
  },
];
 */
function getBuffer(data) {
  return xlsx.build(data);
}

// 生成列头样式
function addXlsxStyle() {
  // 指定单元格内容样式：四个方向的黑边框
  let contentCellStyle = {
    border: {
      top: {
        style: "medium",
        color: "#000",
      },
      bottom: {
        style: "medium",
        color: "#000",
      },
      left: {
        style: "medium",
        color: "#000",
      },
      right: {
        style: "medium",
        color: "#000",
      },
    },
  };
  // 指定标题单元格样式：加粗居中
  let headerStyle = {
    font: {
      bold: true,
    },
    alignment: {
      horizontal: "center",
    },
  };
}

function genXlsxStyle(data) {
  return xlsx.build(data);
}

function formatJson(filterVal, jsonData) {
  return jsonData.map((v) => filterVal.map((j) => v[j]));
}

function filterData(filterObj, data) {
  if (isObject(filterObj)) {
    if (!isEmpty(filterObj)) {
      let header = [];
      let field = [];
      Object.keys(filterObj).forEach((ele) => {
        header.push(filterObj[ele]);
        field.push(ele);
      });

      const filterData = formatJson(field, data);

      const excelData = {
        name: "sheet1",
        data: [header, ...filterData],
      };

      return [excelData];
    } else {
      console.log("不能传入空Object对象");
    }
  } else {
    console.log("入参的类型为Object对象");
  }
}

module.exports = {
  generateExcelSheet,
  getBuffer,
  filterData,
};
