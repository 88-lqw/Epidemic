const app = getApp();
const util = require('../../utils/util.js');
Component({
  properties: {

  },
  options: {
    addGlobalClass: true,
  },
  data: {
    userInfo: {},
    cateList: {},
    dataList: {},
    page: 1,
    limit: 10,
    dataNull: false,
    TabCur: ''
  },
  methods: {
    //前往文章详情
    goDetail(e) {
      wx.navigateTo({
        url: '/pages/article/detail/detail?id=' + e.currentTarget.dataset.id,
      })
    },
    //分类选择
    tabSelect(e) {
      if (this.data.TabCur === e.currentTarget.dataset.id) return
      this.data.page = 1
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        dataNull: false
      })
      this.getData()
    },
    //获取分类
    getcate() {
      util.get(app.globalData.ip + '/data/article_cate', {}, true).then(res => {
        this.setData({
          cateList: res.data,
          TabCur: res.data[0].cid
        })
        this.getData()
      })
    },
    //获取文章数据
    getData(load) {
      util.get(app.globalData.ip + '/article/get', {
        articleCate: this.data.TabCur,
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
        if (res.data.length === 0) {
          this.setData({
            dataNull: this.data.page === 1 ? false : true,
            dataList: this.data.page === 1 ? [] : this.data.dataList
          })
          return;
        }
        this.setData({
          dataList: load === 'more' ? this.data.dataList.concat(res.data) : res.data,
          dataNull: res.data.length === this.data.limit  ? false : true,
        })
      })
    },
    //加载下一页
    getMore() {
      console.log('加载下一页')
      if (this.data.dataNull) return
      this.data.page += 1
      this.getData('more')
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
      this.getcate()
    }
  }
})