const app = getApp();
const util = require('../../utils/util.js');
Component({
  properties: {

  },
  options: {
    addGlobalClass: true,
  },
  data: {
    userInfo:{},
    newGoodsCount:''
  },
  methods: {
    //获取个人数据
    getData(load) {
      util.get(app.globalData.ip + '/user/get', {}, true).then(res => {
        if (load === 'reload') {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          wx.showToast({
            title: '刷新成功',
            duration: 1000
          })
        }
        this.setData({
          userInfo: res.data.user,
          newGoodsCount: res.data.newGoodsCount
        })
      })
    },
    //重新加载
    getReload() {
      wx.showNavigationBarLoading() //在标题栏中显示加载
      this.data.page = 1
      this.getData('reload')
    }
  },
  lifetimes: {
    created() {
      this.getData()
    }
  }
})