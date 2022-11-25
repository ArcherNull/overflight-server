/*
 * @Author: Null
 * @Date: 2022-10-24 15:04:36
 * @Description：请求模型
 */
class BaseModel {
  constructor(data, message) {
    if (typeof data === "string") {
      this.data = null;
      this.message = data;
    } else {
      if (data) {
        this.data = data;
      } else {
        this.data = [];
      }
      if (message) {
        this.message = message;
      } else {
        this.message = "操作成功";
      }
    }
  }
}

class BasePageModel {
  constructor(pageData, message) {
    // 如果传递的data不是对象，是字符串，那么就把data给message
    const { pageSize, currentPage, total, data } = pageData;
    this.data = data;
    this.pageSize = pageSize;
    this.currentPage = currentPage;
    this.total = total;

    if (message) {
      this.message = message;
    } else {
      this.message = "操作成功";
    }
  }
}

// 成功模型
class SuccessModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.code = 200;
  }
}

// 错误模型
class ErrorModel extends BaseModel {
  constructor(message) {
    super(message);
    this.code = 500;
    this.message = message ||  "操作失败";
  }
}

class SuccessPageModel extends BasePageModel {
  constructor(data, message) {
    super(data, message);
    this.code = 200;
  }
}

module.exports = {
  SuccessModel,
  ErrorModel,
  SuccessPageModel,
};
