const app = getApp();
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 1,
    limit: 10,
    dataNull: false
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
  //前往详情
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/article/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  //获取商品列表
  getData(load) {
    util.get(app.globalData.ip + '/user/enroll_list', {
      limit: this.data.limit,
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
          dataList: this.data.page === 1 ? [] : this.data.dataList
        })
        return;
      }
      this.setData({
        dataList: load === 'more' ? this.data.dataList.concat(res.data) : res.data,
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