// pages/MyAddress/add/add.js
const app = getApp();
const util = require('../../../utils/util.js');
let list = []
import { multiArray, objectMultiArray } from '../../../utils/pickerLinkage.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLogin: false,//是否显示授权框
    classArray: ['口罩', '消毒', '测温仪', '其他'],
    ppArray: ['冠桦'],
    zlIndex: [0, 0],
    psIndex: [4, 0],
    startDate: '',//明天日期
    psMultiArray: multiArray,
    psObjectMultiArray: objectMultiArray,
    formData: {
      stopTime: null,
      mobile: '',
      ppIndex: null,
    },
    rules: [{
      name: 'purchaseDesc',
      rules: [{
        required: true,
        message: '产品描述必填'
      }]
    }, {
      name: 'purchaseNum',
      rules: [{
        required: true,
        message: '采购数量必填'
      }]
    }, {
      name: 'stopTime',
      rules: [{
        required: true,
        message: '截止时间必填'
      }]
    }, {
      name: 'contactWechat',
      rules: [{
        required: true,
        message: '微信号必填'
      }]
    }, {
      name: 'contactNumber',
      rules: [{
        required: true,
        message: '手机必填'
      }, {
        mobile: true,
        message: '请输入正确的手机'
      }]
    }],
    imgList: {
      goods: [],
      goodsNum: 6,
    },
    checkLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tomorrow = new Date(new Date(new Date().toLocaleDateString()).getTime() + 86400000).getTime(); //明天
    console.log(util.formatTime(tomorrow, 'year'))
    this.getClass()
    this.getManufacturer()
    this.setData({
      startDate: util.formatTime(tomorrow, 'year'),
      checkLogin: app.globalData.showLogin,
      ['formData.contactNumber']: app.globalData.userInfo.mobile || ''
    })
  },
  onShow: function (options) {

  },
  //产品种类多列选择
  MultiChange(e) {
    this.setData({
      zlIndex: e.detail.value
    })
  },
  MultiColumnChange(e) {
    switch (e.detail.column) {
      case 0:
        this.setData({
          "classArrayR[1]": this.data.classArray[e.detail.value].childList,
          "zlIndex[0]": e.detail.value,
          "zlIndex[1]": 0
        })
    }
  },
  //获取产品分类
  getClass() {
    util.get(app.globalData.ip + '/data/goods_cate', {}, true).then(res => {
      this.setData({
        classArray: res.data,
        classArrayR: [res.data, res.data[0].childList]
      })
    })
  },
  //获取厂商分类
  getManufacturer() {
    util.get(app.globalData.ip + '/data/manufacturer', {
      mType: 1
    }, true).then(res => {
      this.setData({
        ppArray: res.data,
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
    if (app.globalData.showLogin || app.globalData.showPhone) {
      util.askError('请先授权登录~')
      this.setData({
        showLogin: app.globalData.showLogin,
        showPhone: app.globalData.showPhone
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
  //复制手机号
  copyPhone() {
    if (this.data.formData.contactNumber) {
      this.setData({
        ['formData.contactWechat']: this.data.formData.contactNumber
      })
    } else {
      util.askError('手机未授权')
    }
  },
  //发布
  submitForm() {
    let imgs = this.data.imgList,
      formD = this.data.formData
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
        let data = {
          purchaseDesc: formD.purchaseDesc,
          purchaseNum: formD.purchaseNum,
          purchaseCompany: formD.purchaseCompany,
          // manufacturer:this.data.ppArray[formD.ppIndex].mName,
          manufacturer: formD.manufacturer,
          stopTime: formD.stopTime,
          purchaseCate: this.data.classArray[this.data.zlIndex[0]].childList[this.data.zlIndex[1]].cid,
          purchaseShdd: this.data.psMultiArray[0][this.data.psIndex[0]] + ',' + this.data.psMultiArray[1][this.data.psIndex[1]],
          contactNumber: formD.contactNumber,
          contactName: formD.contactName,
          contactWechat: formD.contactWechat,
          purchaseGallery: util.imgAddSuffix(imgs.goods),
        }
        wx.requestSubscribeMessage({
          tmplIds: ['9Z_bZ0CdMTlRnPnCSY6eWkU9j9I-_xQIXlp8zWlwsxw'],
          complete() {
            util.post(app.globalData.ip + '/purchase/create', data, true).then(() => {
              let pages = getCurrentPages(), ind = ''
              for (let i = 0; i < pages.length; i++) {
                if (pages[i].route === "pages/home/home") ind = pages.length - 1 - i
              }
              wx.navigateBack({
                detail: ind,
                success: () => { util.askError('发布成功') },
              })
            })
          }
        })
      }
    })
  },
  //产地选择
  psMultiPickerChange: function (e) {
    this.setData({ "psIndex[0]": e.detail.value[0], "psIndex[1]": e.detail.value[1] })
  },
  psMultiPickerColumnChange: function (e) {
    switch (e.detail.column) {
      case 0: list = []
        for (var i = 0; i < this.data.psObjectMultiArray.length; i++) {
          if (this.data.psObjectMultiArray[i].parid == this.data.psObjectMultiArray[e.detail.value].regid) {
            list.push(this.data.psObjectMultiArray[i].regname)
          }
        }
        this.setData({
          "psMultiArray[1]": list,
          "psIndex[0]": e.detail.value, "psIndex[1]": 0
        })
    }
  },
  //多张图片操作
  MorechooseImage(e) {
    let img = e.currentTarget.dataset.index,
      num = e.currentTarget.dataset.num
    wx.chooseImage({
      count: num || 4, //默认9
      sizeType: 'compressed', //压缩
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (this.data.imgList[img].length !== 0) {
          if (this.data.imgList[img].length + res.tempFilePaths.length > num) {
            util.askError(`图片不能多于${num}张`)
            return
          }
          this.setData({
            [`imgList.${img}`]: this.data.imgList[img].concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            [`imgList.${img}`]: res.tempFilePaths
          })
        }
      }
    });
  },
  showImage(e) {
    let img = e.currentTarget.dataset.url,
      index = e.currentTarget.dataset.index
    console.log(typeof (img))
    wx.previewImage({
      urls: typeof (img) === 'object' ? img : [img],
      current: typeof (img) === 'object' ? img[index] : img
    });
  },
  delImg(e) {
    let img = e.currentTarget.dataset.url,
      index = e.currentTarget.dataset.index, that = this
    let more = false
    if (img === 'goods' || img === 'jcbg') more = true
    wx.showModal({
      title: '删除确认',
      content: '确定要删除张图片吗？',
      success: res => {
        if (res.confirm) {
          if (img === 'goods' || img === 'jcbg') {
            this.data.imgList[img].splice(index, 1);
            that.setData({
              [`imgList.${img}`]: that.data.imgList[img]
            })
          } else {
            that.setData({
              [`imgList.${img}`]: ''
            })
          }
          console.log(`that.data.imgList.${img}`)
        }
      }
    })
  },
  onUnload: function () { },
})