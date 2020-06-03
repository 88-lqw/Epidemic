const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataD: {},
    showLogin: false,
    checkLogin: false,
    formData: {},
    rules: [{
      name: 'companyName',
      rules: [{
        required: true,
        message: '企业名称必填'
      }]
    }, {
      name: 'companyAddress',
      rules: [{
        required: true,
        message: '企业名称必填'
      }]
    }, {
      name: 'contactName',
      rules: [{
        required: true,
        message: '联系人必填'
      }]
    }, {
      name: 'contactNumber',
      rules: [{
        required: true,
        message: '联系电话必填'
      }, {
        mobile: true,
        message: '请输入正确的手机'
      }]
    }, {
      name: 'productDesc',
      rules: [{
        required: true,
        message: '联系电话必填'
      }]
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.articleId = options.id
    this.setData({
      checkLogin: app.globalData.showLogin
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //获取详情
  getData() {
    util.get(app.globalData.ip + '/article/detail', {
      articleId: this.data.articleId
    }, true).then(res => {
      this.setData({
        dataD: res.data
      })
    })
  },

  //输入
  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  //检测是否微信授权
  checkLogin() {
    if (app.globalData.showLogin) {
      util.askError('请先授权登录~')
      this.setData({
        showLogin: app.globalData.showLogin
      })
    }
  },
  //报名
  submitForm() {
    let formD = this.data.formData
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message,
            showTopTips: true
          })
        }
      } else {
        if (app.globalData.showLogin) {
          util.askError('请先授权登录~')
          this.setData({
            showLogin: app.globalData.showLogin
          })
          return
        }
        wx.showModal({
          title: '提示',
          content: '是否确认报名参加',
          success: () => {
            let that = this, data = {
              articleId: that.data.articleId,
              companyName: formD.companyName,
              contactName: formD.contactName,
              contactNumber: formD.contactNumber,
              companyAddress: formD.companyAddress,
              productDesc: formD.productDesc
            }
            wx.requestSubscribeMessage({
              tmplIds: ['9Z_bZ0CdMTlRnPnCSY6eWkU9j9I-_xQIXlp8zWlwsxw'],
              complete() {
                util.post(app.globalData.ip + '/article/enroll', data, true).then(() => {
                  wx.showToast({
                    title: '报名成功'
                  })
                })
              }
            })
          },
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})