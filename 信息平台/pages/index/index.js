const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageCur: 'home',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof (options.cur) !== 'undefined') {
      this.setData({
        PageCur: options.cur
      })
    }
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
  //tabbar跳转
  NavChange(e) {
    let url = e.currentTarget.dataset.cur
    // console.log(e)
    if (url === 'publish') {
      wx.showActionSheet({
        itemList: ['防疫品供应', '防疫品采购'],
        success(res) {
          // console.log(res.tapIndex)
          if (res.tapIndex === 0) {
            wx.navigateTo({
              url: '/pages/publish/supply/supply'
            })
          } else {
            wx.navigateTo({
              url: '/pages/publish/purchase/purchase'
            })
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    } else {
      this.setData({
        PageCur: url
      })
    }
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
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
    this.selectComponent(`#${this.data.PageCur}`).getReload()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.PageCur === 'home' || this.data.PageCur === 'article') {
      this.selectComponent(`#${this.data.PageCur}`).getMore()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})