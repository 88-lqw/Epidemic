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
    ppArray: [],
    bzArray: ['GB/T 26150-2010','GB26373-2010','GB 19083-2010', 'GB 2626-2006', 'YY 0469-2011', 'YY/T 0969-2013', 'GB/T 32610-2016', 'EN 149-2001', 'EN 14683-2019', 'GB 15979-2002', 'GB 14866-2006', 'GB/T20097-2006', 'YY/T 1633-2019', 'YY/T 1642-2019'],
    cdIndex: [4, 0],
    fhIndex: [4, 0],
    zlIndex: [0, 0],
    cdMultiArray: multiArray,
    fhMultiArray: multiArray,
    cdObjectMultiArray: objectMultiArray,
    fhObjectMultiArray: objectMultiArray,
    formData: {
      ppIndex: null,
      bzIndex: null,
      goodsWeight: '',
      goodsSuttle: '',
      goodsSize: '',
      dailyOutput: ''
    },
    rules: [{
      name: 'goodsDesc',
      rules: [{
        required: true,
        message: '产品描述必填'
      }]
    }, {
      name: 'bzIndex',
      rules: [{
        required: true,
        message: '请选择执行标准'
      }]
    }, {
      name: 'goodsPrice',
      rules: [{
        required: true,
        message: '商品价格必填'
      }]
    }, {
      name: 'goodsBzgg',
      rules: [{
        required: true,
        message: '包装规格必填'
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
      goodsV: '',
      goods: [],
      goodsNum: 6,
      cover: '',
      yyzz: '',
      ylqx: '',
      cezs: '',
      fdazs: '',
      cphgz: '',
      jcbg: [],
      jcbgNum: 9
    },
    checkLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getClass()
    this.setData({
      checkLogin: app.globalData.showLogin,
      ['formData.contactNumber']: app.globalData.userInfo.mobile
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
    console.log(this.data.classArray)
    console.log(e.detail.value)
    switch (e.detail.column) {
      case 0:
        this.setData({
          "classArrayR[1]": this.data.classArray[e.detail.value].childList,
          "zlIndex[0]": e.detail.value,
          "zlIndex[1]": 0,
        })
        break;
    }
  },
  //获取商品分类
  getClass() {
    util.get(app.globalData.ip + '/data/goods_cate', {}, true).then(res => {
      this.setData({
        classArray: res.data,
        classArrayR: [res.data, res.data[0].childList]
      })
      console.log(this.data.classArrayR)
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
        console.log(res)
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
      console.log( this.data.formData)
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
      } else if (imgs.cover === '' || !imgs.goods.length) {
        this.setData({
          error: '请上传商品图和封面图',
          showTopTips: true
        })
      } else {
        let data = {
          token: app.globalData.token,
          goodsDesc: formD.goodsDesc,
          // manufacturer: this.data.ppArray[formD.ppIndex].mName,
          manufacturer: formD.manufacturer,
          goodsCid: this.data.classArray[this.data.zlIndex[0]].childList[this.data.zlIndex[1]].cid,
          goodsStandard: this.data.bzArray[formD.bzIndex],
          goodsPrice: formD.goodsPrice,
          goodsFhdd: this.data.fhMultiArray[0][this.data.fhIndex[0]] + ',' + this.data.fhMultiArray[1][this.data.fhIndex[1]],
          goodsBzgg: formD.goodsBzgg,
          goodsWeight: formD.goodsWeight,
          goodsSuttle: formD.goodsSuttle,
          goodsSize: formD.goodsSize,
          goodsOrigin: this.data.cdMultiArray[0][this.data.cdIndex[0]] + ',' + this.data.cdMultiArray[1][this.data.cdIndex[1]],
          dailyOutput: formD.dailyOutput,
          contactNumber: formD.contactNumber,
          contactWechat: formD.contactWechat,
          imageSrc: util.imgAddSuffix(imgs.cover),
          goodsGallery: util.imgAddSuffix(imgs.goods),
          goodsVideo: util.imgAddSuffix(imgs.goodsV),
          businessLicense: util.imgAddSuffix(imgs.yyzz),
          ylqxLicense: util.imgAddSuffix(imgs.ylqx),
          ceLicense: util.imgAddSuffix(imgs.cezs),
          fdaLicense: util.imgAddSuffix(imgs.fdazs),
          qualifiedLicense: util.imgAddSuffix(imgs.cphgz),
          examiningReport: util.imgAddSuffix(imgs.jcbg)
        }
        wx.requestSubscribeMessage({
          tmplIds: ['9Z_bZ0CdMTlRnPnCSY6eWkU9j9I-_xQIXlp8zWlwsxw'],
          complete() {
            util.post(app.globalData.ip + '/goods/create', 
            data, true).then(() => {
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
  cdMultiPickerChange: function (e) {
    this.setData({ "cdIndex[0]": e.detail.value[0], "cdIndex[1]": e.detail.value[1] })
  },
  cdMultiPickerColumnChange: function (e) {
    switch (e.detail.column) {
      case 0: list = []
        for (var i = 0; i < this.data.cdObjectMultiArray.length; i++) {
          if (this.data.cdObjectMultiArray[i].parid == this.data.cdObjectMultiArray[e.detail.value].regid) {
            list.push(this.data.cdObjectMultiArray[i].regname)
          }
        }
        this.setData({
          "cdMultiArray[1]": list,
          "cdIndex[0]": e.detail.value, "cdIndex[1]": 0
        })
    }
  },
  //发货地选择
  fhMultiPickerChange: function (e) {
    this.setData({ "fhIndex[0]": e.detail.value[0], "fhIndex[1]": e.detail.value[1] })
  },
  fhMultiPickerColumnChange: function (e) {
    switch (e.detail.column) {
      case 0: list = []
        for (var i = 0; i < this.data.cdObjectMultiArray.length; i++) {
          if (this.data.fhObjectMultiArray[i].parid == this.data.fhObjectMultiArray[e.detail.value].regid) {
            list.push(this.data.fhObjectMultiArray[i].regname)
          }
        }
        this.setData({
          "fhMultiArray[1]": list,
          "fhIndex[0]": e.detail.value, "fhIndex[1]": 0
        })
    }
  },
  //视频操作
  chooseVideo(e) {
    console.log(e)
    let img = e.currentTarget.dataset.index, that = this
    console.log(img)
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      success: resF => {
        console.log(resF.size)
        if (resF.size > 15 * 1024 * 1000) {
          util.askError('上传视频不能大于15M')
          return
        }
        that.setData({
          [`imgList.${img}`]: resF.tempFilePath
        })
        // wx.compressVideo({
        //   src:resF.tempFilePath,
        //   quality: 'low',
        //   success:resS=>{
        //     console.log(resS)
        //     that.setData({
        //       [`imgList.${img}`]: resS.tempFilePath
        //     })
        //   }
        // })
      },
      fail: fail => {
        console.log(fail)
      }
    })
  },
  showVideo() {
    var videoContext = wx.createVideoContext('goodsV', this);
    videoContext.requestFullScreen();
  },
  //单张图片操作
  chooseImage(e) {
    let img = e.currentTarget.dataset.index, that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: 'compressed', //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: resF => {
        console.log('单张图片')
        console.log(resF)
        that.setData({
          [`imgList.${img}`]: resF.tempFilePaths[0]
        })
        // wx.compressImage({
        //   src: resF.tempFilePaths[0],
        //   quality: 80,
        //   success: resS => {
        //     console.log(resS.tempFilePaths)
        //     that.setData({
        //       [`imgList.${img}`]: resS.tempFilePaths
        //     })
        //   }, fail: ref => {
        //     console.log(ref)
        //   }
        // })
      }
    })
  },
  showImage(e) {
    let img = e.currentTarget.dataset.url,
      index = e.currentTarget.dataset.index
    // console.log(typeof (img))
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
  onUnload: function () { },
})