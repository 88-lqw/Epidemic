function formatTime(time, type = '') {
  var date = new Date(time)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if (type === 'year') {
    return [year, month, day].map(formatNumber).join('-')
  } else {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
}
function splitTime(time, type) {
  switch (type) {
    case 'dateT':
      time = time.substring(5, 16)
      break;
    case 'date':
      time = time.substring(0, 10)
      break;
    case 'dateM':
      time = time.substring(5, 10)
      break;
    default:
      time = time.substring(11, 16)
  }
  console.log(time)
  return time
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 封装微信的的request
 */
function request(url, data = {}, method = "GET", load = false, msg = '请稍等') {
  if (load) wx.showLoading({
    title: msg,
    mask: true
  })
  let app = getApp();
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        "content-type": "application/json",
        "Accept": "application/json",
        "Authorization": app.globalData.token
      },
      success: function (res) {
        if (load) wx.hideLoading()
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 400 && (app.globalData.token === '' || app.globalData.token === undefined)||res.statusCode === 401) {
          //判断是否有openid
          login()
          askError('请重新尝试~')
        } else if (res.data.code === 50001) {//微信未授权
          reject('重新登录');
        } else if (res.data.code === 50008) {//微信未授权
          reject(res.errMsg);
        } else if (res.data.code === 50009) {//手机号未授权
          reject(res.errMsg);
        } else {
          askError(res.data.data.errMsg);
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        askError('服务器正忙，请稍后重试~');
        if (load) wx.hideLoading()
        reject(err)
      }
    })
  });
}

function get(url, data = {}, load = false) {
  return request(url, data, 'GET', load, '加载中')
}

function post(url, data = {}, load = false) {
  return request(url, data, 'POST', load)
}

function put(url, data = {}, load = false) {
  return request(url, data, 'PUT', load)
}

function del(url, data = {}, load = false) {
  return request(url, data, 'DELETE', load)
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        console.log(1111)
        resolve(true);
        return false;
      },
      fail: function () {
        console.log(2222)
        reject(false);
        return true;
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  let app = getApp();
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (resF) {
        if (resF.code) {
          request(app.globalData.ip + "/login/we_chat_login", {
            code: resF.code
          }).then(resS => {
            console.log(resS.data)
            app.globalData.token = resS.data.token;
            console.log(app.globalData.token)
            resolve(resS);
          }).catch((err) => {
            reject(err);
          });
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}
// 获取用户授权信息
function getUserMandate(msg) {
  let app = getApp()
  console.log(app.globalData.userInfo)
  if (!app.globalData.userInfo || app.globalData.userInfo.nickName === "") {
    if (msg) {
      askError(msg)
    }
    return true
  } else return false
}
// 获取用户授权信息
function getUserMandate1() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.checkSession({
            success() {
              resolve('success')
            },
            fail() {
              // session_key 已经失效，需要重新执行登录流程
              wx.login() //重新登录
              reject('重新授权')
            }
          })
        } else {
          reject('重新授权')
        }
      }
    })
  })
}

function redirect(url) {
  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}
//图片添加后缀
function imgAddSuffix(img) {
  if (img === '') {
    return ''
  } else if (typeof (img) === 'object') {
    return img.map(item => {
      // console.log('图片')
      // console.log(item)
      let str = item.substring(item.lastIndexOf('.') + 1)
      console.log(str)
      return `data:image/${str};base64,` + wx.getFileSystemManager().readFileSync(item, 'base64')
    })
  } else {
    let str = img.substring(img.lastIndexOf('.') + 1)
    return `data:image/${str};base64,` + wx.getFileSystemManager().readFileSync(img, 'base64')
  }
}
// 原app.js扩展

//返回上一页并显示msg
function backPageMsg(msg) {
  wx.navigateBack({
    delta: 1,
    success: res => {
      wx.showToast({
        title: msg
      })
    }
  })
}
//报错
function askError(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 1800
  })
}
//加法
function accAdd(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}
//减法
function accMinus(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m - arg2 * m) / m;
}
//乘法
function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) { }
  try {
    m += s2.split(".")[1].length
  } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//除法
function accDiv(arg1, arg2) {
  var t1, t2, r1, r2;
  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    t2 = 0;
  }
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}
module.exports = {
  formatTime,
  splitTime,
  request,
  get,
  post,
  put,
  del,
  redirect,
  checkSession,
  login,
  getUserMandate,
  imgAddSuffix,
  backPageMsg,
  askError,
  accMul,
  accAdd,
  accMinus,
  accDiv
}