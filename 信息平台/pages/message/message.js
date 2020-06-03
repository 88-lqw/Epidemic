const app = getApp();
const util = require('../../utils/util.js');
Component({
  properties: {

  },
  options: {
    addGlobalClass: true,
  },
  data: {
    msgList: [],
    page: 1,
    limit:10,
    dataNull: false
  },
  methods: {
    getData(load) {
      util.get(app.globalData.ip + '/message/get', {
        page: this.data.page,
        limit: this.data.limit
      }, true).then(res => {
        if (load === 'reload') {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          wx.showToast({
            title: '刷新成功',
            duration: 1000
          })
        }
        let date = new Date(),
          dateT = util.formatTime(date)
        res.data = res.data.map(item => {
          let today = util.splitTime(item.createTime, 'date') === util.splitTime(dateT, 'date')
          item.createTime = util.splitTime(item.createTime, today ? '' : 'date')
          return item
        })
        if (res.data.length === 0) {
          this.setData({
            dataNull: this.data.page === 1 ? false : true,
            msgList: this.data.page === 1 ? [] : this.data.msgList
          })
          return;
        }
        this.setData({
          msgList: load === 'more' ? this.data.msgList.concat(res.data) : res.data,
          dataNull: res.data.length === this.data.limit ? false : true,
        })
      })
    },
    getMore() {
      console.log('加载下一页')
      if (this.data.dataNull) return
      this.data.page += 1
      this.getData('more')
    },
    goDetail(){
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