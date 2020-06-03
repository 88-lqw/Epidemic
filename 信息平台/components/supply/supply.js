const util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: {
      type: Array,
      value: []
    },
    self:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //前往详情
    goDetail(e) {
      if (e.currentTarget.dataset.status === 0) util.askError('商品正在审核中~')
      else wx.navigateTo({
        url: '/pages/goodsList/detail/detail?type=0&id=' + e.currentTarget.dataset.id
      })
    },
  }
})
