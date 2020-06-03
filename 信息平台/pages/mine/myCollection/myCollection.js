const app = getApp();
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    page: 1,
    TabCur:'GY',
    dataNull: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  //商品分类
  tabSelect(e) {
    if (this.data.TabCur === e.currentTarget.dataset.id) return
    console.log(e.currentTarget.dataset.id)
    this.data.page = 1
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      dataNull: false
    })
    this.getData()
  },
  //获取商品列表
  getData(load) {
    util.get(app.globalData.ip + '/user/collect_list', {
      type: this.data.TabCur,
      page: this.data.page
    }, true).then(res => {
      if (load === 'reload') {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
          title: '刷新成功',
          duration: 1000
        })
      }
      if (res.data.length === 0) {
        this.setData({
          dataNull: this.data.page === 1 ? false : true,
          goodsList: this.data.page === 1 ? [] : this.data.goodsList
        })
        return;
      }
      this.setData({
        goodsList: load === 'more' ? this.data.goodsList.concat(res.data) : res.data,
        dataNull: res.data.length === 10 ? false : true,
      })
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.data.page = 1
    this.getData('reload')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('加载下一页')
    if (this.data.dataNull) return
    this.data.page += 1
    this.getData('more')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})