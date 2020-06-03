const app = getApp()
const util = require('../../utils/util.js');
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    showLogin: {
      type: Boolean,
      value: false
    },
    showPhone: {
      type: Boolean,
      value: false
    },
    checkLogin: {
      type: Boolean,
      value: false
    }
  },
  data: {
    // 这里是一些组件内部数据
  },
  methods: {
    // 微信授权
    bindgetUserInfo(e) {
      let that = this;
      wx.checkSession({
        success() {
          wx.getUserInfo({
            success: function (res) {
              util.post(app.globalData.ip + "/login/we_chat_register", {
                iv: res.iv,
                encryptedData: res.encryptedData,
                rawData: res.rawData,
                signature: res.signature,
                miniType: 'bwd'
              }, true).then(res => {
                app.globalData.userInfo = res.data;
                app.globalData.showLogin = false;
                let pages = getCurrentPages();
                let currPage = pages[pages.length - 1];   //当前页面
                currPage.setData({
                  showLogin: false,
                  checkLogin: false
                })
                // that.setData({
                //   showLogin: false,
                //   checkLogin: false
                // })
                wx.showToast({
                  title: '授权成功'
                })
              })
            },
            fail: () => {
              app.globalData.showLogin = true;
              that.setData({
                showLogin: false
              })
            }
          })
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          wx.login() //重新登录
        }
      })
    },
    //手机授权
    bindgetphonenumber(e) {
      let that = this
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        util.put(app.globalData.ip + '/user/update_mobile', {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          miniType: 'bwd'
        }).then(res => {
          app.globalData.showPhone = false;
          let pages = getCurrentPages();
          let currPage = pages[pages.length - 1];   //当前页面
          currPage.setData({
            showPhone: false,
            ['formData.contactNumber']: res.data.mobile
          })
          // that.setData({
          //   showPhone: false
          // })
          util.askError('手机授权成功')
        })
      } else {
        app.globalData.showPhone = true;
        that.setData({
          showPhone: false
        })
      }
    },
    checkLogin() {
      util.askError('请先进行微信授权')
    },
    // cancel() {
    //   this.setData({
    //     isLogin: false
    //   })
    //   util.askError('拒绝授权');
    // }
  }
})