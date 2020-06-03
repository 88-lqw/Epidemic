const app = getApp();
const util = require('../../utils/util.js');
Component({
  properties: {
    floorstatus: {//显示返回顶部
      type: Boolean,
      value: false
    }
  },
  options: {
    addGlobalClass: true,
  },
  data: {
    searchText: '',//搜索文本
    cardCur: 0,//轮播图
    page: 1,
    homeData: {},
    goodsList: [],
    PageCur: 'home',
    dataNull: false,
  },
  methods: {
    //回到顶部
    goTop(e) {  // 一键回到顶部
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    },
    //搜索文本
    searchInput(e) {
      this.setData({
        searchText: e.detail.value
      })
    },
    //清空搜索文本
    searchClose() {
      this.setData({
        searchText: ''
      })
    },
    //搜索商品
    searchGoods(e) {
      if (this.data.searchText === "") {
        util.askError('搜索文本不能为空')
        return false
      }
      wx.navigateTo({
        url: `/pages/goodsList/goodsList?text=${e.detail.value}`,
      })
    },
    //轮播图
    cardSwiper(e) {
      this.setData({
        cardCur: e.detail.current
      })
    },
    //前往蓝牙测温小程序
    goBlueT() {
      // util.askError('正在升级，敬请期待~')
      wx.navigateToMiniProgram({
        appId: 'wxec7c1b050e044b9a',
        path: '',
        extraData: {
        },
        envVersion: 'release',//跳转版本
        success(res) {
          console.log(res)
        }
      })
    },
    //获取首页数据
    getData(load) {
      util.get(app.globalData.ip + '/home/get', {}, true).then(res => {
        if (load === 'reload') {
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          wx.showToast({
            title: '刷新成功',
            duration: 1000
          })
        }
        this.setData({
          homeData: res.data,
          goodsList: res.data.goods,
          infoList: res.data.purchase,
        })
      })
    },
    //获取最新商品数据
    getList(load) {
      util.get(app.globalData.ip + '/home/goods_list', {
        page: this.data.page,
        limit: 10
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
    //加载下一页
    getMore() {
      console.log('加载下一页')
      if (this.data.dataNull) return
      this.data.page += 1
      this.getList('more')
    },
    //重新加载
    getReload() {
      wx.showNavigationBarLoading() //在标题栏中显示加载
      this.data.page = 1
      this.getData('reload')
    },
    //nav跳转
    NavChange(e) {
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];   //当前页面
      currPage.setData({
        PageCur: e.currentTarget.dataset.cur
      })
    }
  },
  lifetimes: {
    created() {
      this.getData()
    }
  }
})