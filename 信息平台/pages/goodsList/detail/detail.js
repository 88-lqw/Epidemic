const util = require('../../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLogin: false,//是否显示授权框
    showPhone: false,//是否显示授权框
    goodGallery: ['https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg', 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg', 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg', 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg'],
    goodsId: '',
    goodsD: {},
    infoType: 0,
    userInfo: app.globalData.userInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.goodsId = options.id
    if (typeof (options.type) !== 'undefined') {
      this.setData({
        infoType: parseInt(options.type)
      })
      wx.setNavigationBarTitle({
        title: '防疫采购信息',
      })
    }
    this.getData()
    // this.setData({
    //   userInfo: app.globalData.userInfo
    // })
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
  //前往用户发布列表
  goUser(e) {
    let goodsD = this.data.goodsD, data = {
      infoType: this.data.infoType,
      userId: goodsD.userId,
      releaseCount: this.data.infoType ? goodsD.purchaseReleaseCount : goodsD.goodsReleaseCount,
      id: this.data.infoType ? goodsD.infoId : goodsD.goodsId,
      nickName: goodsD.nickName,
      avatarUrl: goodsD.avatarUrl
    }
    wx.navigateTo({
      url: '/pages/goodsList/user/user?data=' + JSON.stringify(data)
    })
  },
  //获取商品列表
  getData() {
    let data = {}
    if (!this.data.infoType) {
      data.goodsId = this.data.goodsId
    } else {
      data.infoId = this.data.goodsId
    }
    util.get(`${app.globalData.ip}/${this.data.infoType ? 'purchase' : 'goods'}/detail`, data, true).then(res => {
      if (!res.data.goodsId && !res.data.infoId) {
        wx.navigateBack({
          success: () => {
            util.askError('信息不存在，请重试')
          }
        })
      } else if (!this.data.infoType && res.data.goodsImageList.length !== 0) {
        res.data.goodsImageList[0].imageList.unshift(res.data.imageSrc)
      }
      this.setData({
        goodsD: res.data
      })
    }).catch(() => {
      wx.navigateBack({
        success: () => {
          util.askError('信息不存在，请重试')
        }
      })
    })
  },
  //查看图片
  showImage(e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.urls,
      current: e.currentTarget.dataset.index
    });
  },
  //收藏商品
  goodsCollect() {
    if (app.globalData.showLogin || app.globalData.showPhone) {
      util.askError('请先授权登录~')
      this.setData({
        showLogin: app.globalData.showLogin,
        showPhone: !app.globalData.showPhone
      })
      return
    }
    if (this.data.goodsD.isCollect === 0) {
      util.post(app.globalData.ip + '/goods/collect', {
        goodsId: this.data.goodsId
      }, true).then(() => {
        this.setData({
          ['goodsD.isCollect']: 1
        })
        wx.showToast({
          title: '收藏成功',
          duration: 1200
        })
      })
    } else {
      util.post(app.globalData.ip + '/goods/un_collect', {
        goodsId: this.data.goodsId
      }).then(() => {
        this.setData({
          ['goodsD.isCollect']: 0
        })
        util.askError('取消收藏')
      })
    }
  },
  //意向购买
  wantPay() {
    util.post(app.globalData.ip + '/goods/to_buy', {
      goodsId: this.data.goodsId
    })
  },
  //购买商品
  goodsPay() {
    if (app.globalData.showLogin || app.globalData.showPhone) {
      util.askError('请先授权登录~')
      this.setData({
        showLogin: app.globalData.showLogin,
        showPhone: app.globalData.showPhone
      })
      return
    }
    let that = this
    if (app.globalData.userInfo.freeNum > 0) {
      wx.showModal({
        title: '购买信息',
        content: `您还有 ${app.globalData.userInfo.freeNum} 次免费查看信息的机会，是否使用？`,
        success: res => {
          if (res.confirm) {
            util.post(app.globalData.ip + '/order/create', {
              goodsId: that.data.goodsId,
              isUseFree: 1
            }).then(res => {
              that.getData()
              util.askError('购买成功')
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '购买信息',
        content: `是否支付¥ ${that.data.goodsD.infoPrice} 元购买联系信息？`,
        success: res => {
          if (res.confirm) {
            util.post(app.globalData.ip + '/order/create', {
              goodsId: that.data.goodsId,
              isUseFree: 0
            }).then(res => {
              console.log(res)
              wx.requestPayment({
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                package: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,
                success(res) {
                  that.getData()
                  util.askError('购买成功')
                },
                fail(fail) {
                  util.askError('支付失败~')
                }
              })
            })
          }
        }
      })
    }
  },
  //拨打电话
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.goodsD.contactNumber
    })
  },
  //复制微信号
  copyNumber() {
    wx.setClipboardData({
      data: this.data.goodsD.contactWechat,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '复制成功',
              duration: 1200,
            })
          }
        })
      }
    })
  },
  //删除商品
  goodsDel() {
    wx.showModal({
      title: '删除确认',
      content: '是否确认删除该商品',
      success: res => {
        if (res.confirm) {
          util.del(app.globalData.ip + '/goods/delete', {
            goodsId: this.data.goodsId
          }).then(() => {
            wx.navigateBack({
              success: () => {
                util.askError('删除成功')
              }
            })
          })
        }
      }
    })
  },  /**
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
    return {
      title: this.data.goodsD.goodsDesc,
      path: `/pages/goodsList/detail/detail?id=${this.data.goodsId}`,
      imageUrl: this.data.goodsD.imageSrc
    }
  }
})