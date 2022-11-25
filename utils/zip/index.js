/*
 * @Author: Null
 * @Date: 2022-11-01 13:58:53
 * @Description: zip 解压和压缩
 */
const { isEmpty, isArray, reject } = require("lodash");
const compressing = require("compressing");
const fs = require("fs");
const md5 = require("md5");
const path = require("path");

const {
  BASE_URL,
  PORT,
  NAME,
  UPLOAD_ZIP_PATH,
  ZIP_FILENAME_ENCODING,
} = require("../../config");

/**
 * @description: 生成随机文件名
 * @param {String} fileName
 * @return {*}
 */
function generateFileName(fileName) {
  const randomFilename = md5(new Date()); // md5(new Date());
  return fileName ? `${randomFilename}-${fileName}` : randomFilename;
}

/**
 * @description: 解析绝对路径为相对路径
 * @param {*} path
 * @return {*}
 */
function parseRelativePath(path) {
  if (path.indexOf(NAME) !== -1) {
    const splitArr = path.split(NAME);
    return splitArr[1]?.replace(/\\/g, "/");
  } else {
    console.log("请输入绝对路径");
  }
}

/**
 * @description: 生成文件绝对路径
 * @param {String} filePath 文件路径
 * @return {*}
 */
function generatePath(filePath) {
  const pathUrl = path.join(__dirname, "../../", filePath);
  return pathUrl;
}

/**
 * @description: 判断文件是否存在
 * @param {String} filePath 文件路径
 * @return {*}
 */
function isFileExisted(filePath, type = "makeDir") {
  return new Promise((resolve, reject) => {
    const { F_OK, W_OK, R_OK } = fs.constants;
    fs.access(filePath, F_OK | W_OK | R_OK, (err) => {
      if (err) {
        console.log("当前文件不存在===>", err);
        const msgText = `路径为${err.path}文件不存在`;
        const doFun = () => {
          if (type === "makeDir") {
            resolve(msgText);
          } else {
            reject(msgText);
          }
        };
        if (err.code === "ENOENT") {
          console.log("fs.constants.F_OK表示====>不存在", F_OK);
          console.log("fs.constants.R_OK表示====>不可读", R_OK);
          console.log("fs.constants.W_OK表示====>不可写", W_OK);
          doFun();
        } else {
          doFun();
        }
      } else {
        console.log("当前文件存在,且可读可写");
        resolve(filePath); //"存在"
      }
    });
  });
}

/**
 * @description: 创建文件夹名
 * @param {String} dirname 文件夹名
 * @return {*}
 */
function makeDir(dirname) {
  return new Promise((resolve, reject) => {
    console.log("__dirname", dirname);
    if (dirname) {
      fs.mkdir(dirname, function (err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("创建目录成功", dirname);
          resolve(dirname);
        }
      });
    } else {
      reject("请输入创建文件夹的路径");
    }
  });
}

/**
 * @description: 可读文件遍历
 * @param directory 目录文件夹
 * @param useSubdirectories 是否继续向该目录下的文件夹遍历文件
 * @param extList 文件夹名
 * @return {*}
 */
function enumerableFile(
  directory,
  useSubdirectories = false,
  extList = [".java"]
) {
  return new Promise((resolve, reject) => {
    const logFun = (text, val = false) => {
      console.log(text || `文件夹${directory}下未存在${extList.join("/")}文件`);
      reject(val);
    };
    if (directory) {
      const filesList = [];
      const getPathInfo = (p) => path.parse(p);

      // 递归读取文件
      function readFileList(directory, useSubdirectories, extList) {
        const files = fs.readdirSync(directory);
        if (files && Array.isArray(files) && files.length) {
          console.log("files=====>", files);
          files.forEach((item) => {
            const fullPath = path.join(directory, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory() && useSubdirectories) {
              readFileList(
                path.join(directory, item),
                useSubdirectories,
                extList
              );
            } else {
              const info = getPathInfo(fullPath);
              extList.includes(info.ext) && filesList.push(fullPath);
            }
          });
        } else {
          logFun(`文件夹${directory}下未存在${extList.join("/")}文件`);
        }
      }

      readFileList(directory, useSubdirectories, extList);

      // 生成需要的对象
      if (filesList.length) {
        const res = filesList.map((item) => ({
          path: item,
          ...getPathInfo(item),
        }));
        console.log(`遍历文件夹${directory}下的${extList.join("/")}文件`, res);
        resolve(res);
      } else {
        logFun(`文件夹${directory}下未存在${extList.join("/")}文件`);
      }
    } else {
      logFun(`读取文件夹名不能为空！`);
    }
  });
}

/**
 * @description: 检测文件名是否存在，不存在则创建，存在则忽略
 * @param {String} dirname 文件夹名
 * @return {*}
 */
function fileIsEmptyAndMakeDir(dirname) {
  return new Promise((resolve, reject) => {
    if (dirname) {
      isFileExisted(dirname, "makeDir")
        .then((filePath) => {
          console.log("当前文件存在=====>", filePath);
          if (filePath.indexOf("文件不存在") !== -1) {
            console.log("dirname=====>", dirname);
            return makeDir(dirname);
          } else {
            return Promise.resolve(filePath);
          }
        })
        .then((filePath) => {
          console.log("filePath======>", filePath);
          resolve(filePath);
        })
        .catch((error) => {
          reject("文件创建失败", error);
        });
    } else {
      reject("文件路径是必传项");
    }
  });
}

/**
 * @description: 解压一个压缩包
 * @param {String} filePath 文件或文件夹路径
 * @return {*}
 */
function uncompress(filePath, unComDir, saveInCurrentFile = false) {
  return new Promise((resolve, reject) => {
    const { dir } = path.parse(filePath);
    let unCompressDir = "";

    if (saveInCurrentFile) {
      unCompressDir = unComDir ? `${dir}\\${unComDir}` : dir;
    } else {
      unCompressDir = generatePath(`${UPLOAD_ZIP_PATH}/${unComDir}`);
    }
    fileIsEmptyAndMakeDir(unCompressDir)
      .then((dirname) => {
        return compressing.zip.uncompress(filePath, dirname, {
          zipFileNameEncoding: ZIP_FILENAME_ENCODING,
        });
      })
      .then(() => {
        // 解压到compress文件夹下，并不知道compress文件夹下的文件类型，所以没有办法拿取解压后的文件路径
        // console.log("unCompressDir=====>", unCompressDir);
        return enumerableFile(unCompressDir, false, [".jpg", ".png", "jpeg"]);
      })
      .then((filesList) => {
        console.log("filesList==123===>", filesList);
        const comPath = parseRelativePath(unCompressDir);
        // console.log("comPath=====>", comPath);

        const url = `${BASE_URL}:${PORT}${comPath}`;

        if (filesList?.length) {
          const urlArr = filesList?.map((ele) => {
            const { base } = ele;
            return {
              shortUrl: `${comPath}/${base}`,
              url: `${url}/${base}`,
            };
          });

          console.log("urlArr", urlArr);

          resolve(urlArr);
        } else {
          reject("解压失败");
        }
      })
      .catch((error) => {
        reject(error || "解压失败");
      });
  });
}

/**
 * @description: 解压压缩包，文件路径只能有一个
 * @param {Object} reqBody 请求体
 * @param {Boolean} saveInCurrentFile 是否保存到当前文件夹
 * @return {*}
 */
exports.unCompressFile = (
  reqBody,
  unComDir = "unCompress",
  saveInCurrentFile = true
) => {
  return new Promise((resolve, reject) => {
    const { filePath } = reqBody;
    if (filePath) {
      const pathUrl = generatePath(filePath);

      console.log("pathUrl=====>", pathUrl);
      isFileExisted(pathUrl)
        .then((fileUrl) => {
          return uncompress(fileUrl, unComDir, saveInCurrentFile);
        })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error || "解压压缩包失败");
        });
    } else {
      reject("请传入正确的文件路径");
    }
  });
};

/**
 * @description: 压缩单个文件
 * @param {*} reqBody body请求体
 * @param {*} comDir 存放压缩文件的文件夹名称
 * @param {Boolean} saveInCurrentFile 是否保存到当前文件夹
 * @return {*}
 */
exports.compressFile = (
  reqBody,
  comDir = "compress",
  saveInCurrentFile = false
) => {
  return new Promise((resolve, reject) => {
    const { filePath } = reqBody;
    // 去除重名文件
    if (filePath) {
      const filePathArr = formatFileList(filePath);
      if (filePathArr?.length === 1) {
        const pathUrl = generatePath(filePath);
        isFileExisted(pathUrl)
          .then((fileUrl) => {
            return compressFileFun(fileUrl, comDir, saveInCurrentFile);
          })
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error || "解压压缩包失败");
          });
      } else {
        reject("单文件压缩,只允许上传一个文件路径");
      }
    } else {
      reject("请传入文件路径");
    }
  });
};

/**
 * @description: 压缩单个文件
 * @param {String} filePath 文件路径
 * @param {String} comDir 新生成的文件夹，用于存放压缩文件的
 * @param {String} ext 压缩文件后缀名 ， 如zip、gzip、tgz、tar
 * @param {Boolean} saveInCurrentFile 是否保存到当前文件夹
 * @return {*}
 */
function compressFileFun(
  filePath,
  comDir,
  saveInCurrentFile = false,
  ext = ".zip"
) {
  return new Promise((resolve, reject) => {
    const { dir, name } = path.parse(filePath);
    let compressDir = "";
    if (saveInCurrentFile) {
      compressDir = comDir ? `${dir}\\${comDir}` : dir;
    } else {
      compressDir = generatePath(`${UPLOAD_ZIP_PATH}/${comDir}`);
    }

    fileIsEmptyAndMakeDir(compressDir)
      .then((dirname) => {
        const fixedUrl = `${UPLOAD_ZIP_PATH}/${comDir}/${name}${ext}`;
        const fixedPath = generatePath(fixedUrl);

        const compressPath = saveInCurrentFile
          ? `${dirname}\\${name}${ext}`
          : fixedPath;
        // 压缩一个文件
        compressing.zip
          .compressFile(filePath, compressPath, {
            zipFileNameEncoding: ZIP_FILENAME_ENCODING,
          })
          .then(() => {
            const shortUrl = parseRelativePath(compressPath);
            console.log("shortUrl", shortUrl);
            const url = `${BASE_URL}:${PORT}${shortUrl}`;

            resolve({
              shortUrl,
              url,
            });
          })
          .catch((error) => {
            console.log("error", error);

            reject(error || "压缩失败");
          });
      })
      .catch((error) => {
        console.log("error", error);
        reject(error || "压缩失败");
      });
  });
}

/**
 * @description: 多文件压缩，添加正确的文件路径
 * @param {*} filePathArr
 * @return {*}
 */
function addCompressMultiFile(filePathArr) {
  return new Promise((resolve, reject) => {
    let promiseArray = filePathArr.map(async (ele) => {
      const pathUrl = generatePath(ele);
      return await isFileExisted(pathUrl);
    });

    Promise.all(promiseArray)
      .then((resData) => {
        resolve(resData);
      })
      .catch((error) => {
        console.log("error=====>", error);
        reject(error || "未获取到压缩文件路径");
      });
  });
}

function formatFileList(filePath) {
  // 过滤无文件路径以及路径字符串前后空格
  const filePathArray = filePath
    ?.split(",")
    ?.filter((ele) => Boolean(ele))
    ?.map((ele) => ele.trim());

  // 去除重名文件
  const filePathArr = Array.from(new Set(filePathArray));
  return filePathArr;
}

/**
 * @description: 多个文件压缩
 * @param {String[]} filePathArr 文件路径数组
 * @param {String} zipName 压缩后的压缩包名
 * @return {*}
 */
exports.compressMultiFile = (reqBody, comDir = "compress", ext = ".zip") => {
  return new Promise((resolve, reject) => {
    const { filePath } = reqBody;

    // 去除重名文件
    const filePathArr = formatFileList(filePath);

    if (isArray(filePathArr)) {
      if (!isEmpty(filePathArr)) {
        // 同时压缩多个文件和文件夹，采用 stream 的方式
        const zipStream = new compressing.zip.Stream();

        addCompressMultiFile(filePathArr)
          .then((fileUrlList) => {
            console.log("fileUrlList=====>", fileUrlList);

            if (fileUrlList?.length) {
              fileUrlList.forEach((ele) => {
                zipStream.addEntry(ele);
              });

              const shortPath = `${UPLOAD_ZIP_PATH}\\${comDir}`;
              const fileName = `${generateFileName()}${ext}`;
              const compressFilePath = `${generatePath(
                shortPath
              )}\\${fileName}`;

              zipStream
                .pipe(fs.createWriteStream(compressFilePath))
                .on("finish", () => {
                  const shortUrl = `${UPLOAD_ZIP_PATH}/${comDir}/${fileName}`;
                  const url = `${BASE_URL}:${PORT}${shortUrl}`;
                  resolve(
                    {
                      url,
                      shortUrl,
                    },
                    "压缩成功"
                  );
                })
                .on("error", () => {
                  reject("压缩失败");
                });
            } else {
              reject("未获取到压缩文件路径");
            }
          })
          .catch((error) => {
            console.log("error=====>123", error);
            reject(error || "未获取到压缩文件路径");
          });
      } else {
        reject("filePathArr不能为空数组");
      }
    } else {
      reject("filePathArr入参类型为数组");
    }
  });
};
