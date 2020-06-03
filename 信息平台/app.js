//app.js
const util = require('./utils/util.js');
App({
  globalData: {
    ip: "https://mask.chinabwd.com",//http://192.168.3.7:9301 //http://192.168.1.105:9301 //https://bwd.mynatapp.cc
    userInfo: null,
    showLogin: false,
    showPhone: false
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          util.get(this.globalData.ip + "/login/we_chat_login", {
            code: res.code,
            miniType: 'bwd'
          }, true).then(res => {
            if (res.data) {
              this.globalData.token = res.data.token
              util.get(this.globalData.ip + "/user/get").then(res => {
                this.globalData.userInfo = res.data.user
                this.globalData.showPhone = res.data.user.mobile === "" ? true : false
              })
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.checkSession({
            fail() {
              this.globalData.showLogin = true
              wx.login() //重新登录
            }
          })
        } else {
          this.globalData.showLogin = true
        }
      }
    })
  }
})