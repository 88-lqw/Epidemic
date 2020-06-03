const util = require('../../utils/util.js');
const app = getApp();
let list = []
import { multiArray, objectMultiArray } from '../../utils/pickerLinkage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchInd: null,
    searchText: '',//搜索文本
    TabCur: '0',
    page: 1,
    limit: 10,
    dataNull: false,
    goodsList: [],
    classArray: [],//搜索分类
    classArrayR: [],
    classInd: [],
    // ppArray: [],//搜索厂商
    // ppInd:'',
    cityName: '城市',
    csIndex: [0, 0],
    csMultiArray: [],
    csObjectMultiArray: [],
    floorstatus: false//显示返回顶部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (typeof (options.cid) !== "undefined") {
      this.setData({
        TabCur: options.cid
      })
    }
    if (typeof (options.text) !== "undefined") {
      this.setData({
        searchText: options.text
      })
    }
    this.getClass()
    this.cityPush()
    // this.getManufacturer()
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
    this.getData()
  },
  //搜索条件选中
  changeSearch(e) {
    this.setData({
      searchInd: e.currentTarget.dataset.ind
    })
  },
  //搜索条件失焦
  cancelSearch() {
    this.setData({
      searchInd: null
    })
  },
  //修改城市列表
  cityPush() {
    if (multiArray[0][0] !== '全部') {
      multiArray[0].unshift("全部")
      multiArray[1] = ["城市"]
      objectMultiArray.unshift({
        "regid": "0",
        "parid": "0",
        "regname": "城市",
        "regtype": "2",
        "ageid": "0"
      })
    }
    this.setData({
      csMultiArray: multiArray,
      csObjectMultiArray: objectMultiArray
    })
  },
  //获取厂商分类
  // getManufacturer() {
  //   util.get(app.globalData.ip + '/data/manufacturer', {
  //     mType: 1
  //   }, true).then(res => {
  //     this.setData({
  //       ppArray: res.data,
  //     })
  //   })
  // },
  //输入
  // formInputChange(e) {
  //   const {
  //     field
  //   } = e.currentTarget.dataset
  //   this.setData({
  //     [`${field}`]: e.detail.value
  //   })
  // },
  //获取商品列表
  getData(load) {
    let city = this.data.csMultiArray[1][this.data.csIndex[1]]
    let cid = ''
    if (this.data.classInd.length !== 0) {
      cid = this.data.classArray[this.data.classInd[0]].childList[this.data.classInd[1]].cid || ''
    }
    let data = {
      goodsDesc: this.data.searchText,
      // manufacturer: this.data.searchText,
      page: this.data.page,
      limit: this.data.limit
    }
    if (this.data.TabCur == 0) {
      data.goodsCid = cid
      data.goodsFhdd = city === '城市' ? '' : city
    } else {
      data.purchaseCate = cid
      data.purchaseShdd = city === '城市' ? '' : city
    }
    util.get(`${app.globalData.ip}/${this.data.TabCur == 0 ? 'goods' : 'purchase'}/get`, data, true).then(res => {
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
        dataNull: res.data.length === this.data.limit ? false : true,
      })
    })
  },
  //获取商品分类
  getClass() {
    util.get(app.globalData.ip + '/data/goods_cate', {}, true).then(res => {
      this.setData({
        classArray: res.data,
        classArrayR: [res.data, res.data[0].childList]
      })
    })
  },
  //产品种类多列选择
  MultiChange(e) {
    if (this.data.classInd !== e.detail.value) {
      this.setData({
        classInd: e.detail.value
      })
      this.page = 1
      this.getData()
    }
  },
  MultiColumnChange(e) {
    switch (e.detail.column) {
      case 0:
        this.setData({
          "classArrayR[1]": this.data.classArray[e.detail.value].childList,
          "classInd[0]": e.detail.value,
          "classInd[1]": 0
        })
    }
  },
  //商品分类
  tabSelect(e) {
    if (this.data.TabCur === e.currentTarget.dataset.id) return
    this.data.page = 1
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      dataNull: false
    })
    this.getData()
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
    // if (this.data.searchText === "") {
    //   util.askError('搜索文本不能为空')
    //   return false
    // }
    // this.data.searchText = e.detail.value
    this.data.page = 1
    this.setData({
      dataNull: false
    })
    this.getData()
  },
  //城市选择
  csMultiPickerChange: function (e) {
    if (this.data.cityName !== this.data.csMultiArray[1][e.detail.value[1]]) {
      this.data.page = 1;
      this.setData({ "csIndex[0]": e.detail.value[0], "csIndex[1]": e.detail.value[1], cityName: this.data.csMultiArray[1][e.detail.value[1]] })
      this.getData()
    }
  },
  csMultiPickerColumnChange: function (e) {
    switch (e.detail.column) {
      case 0: list = []
        for (var i = 0; i < this.data.csObjectMultiArray.length; i++) {
          if (this.data.csObjectMultiArray[i].parid == this.data.csObjectMultiArray[e.detail.value].regid) {
            list.push(this.data.csObjectMultiArray[i].regname)
          }
        }
        this.setData({
          "csMultiArray[1]": list,
          "csIndex[0]": e.detail.value,
          "csIndex[1]": 0
        })
    }
  },
  //手机授权
  bindgetphonenumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      util.put(app.globalData.ip + '/user/update_mobile', {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      }).then((res) => {
        this.setData({
          ['formData.contactNumber']: res.data.mobile
        })
        util.askError('授权成功')
      })
    }
  },
  //前往发布
  goPublish() {
    wx.showActionSheet({
      itemList: ['防疫品供应', '防疫品采购'],
      success(res) {
        console.log(res.tapIndex)
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
  },
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