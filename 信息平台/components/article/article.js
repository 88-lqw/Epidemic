const util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataList: {
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
    //前往文章详情
    goDetail(e) {
      wx.navigateTo({
        url: '/pages/article/detail/detail?id='+e.currentTarget.dataset.id,
      })
    },
  }
})
