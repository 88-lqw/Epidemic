// components/tabbar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    PageCur: {
      type: String,
      value: 'home'
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
    NavChange(e) {
      let url = e.currentTarget.dataset.cur
      wx.redirectTo({
        url: `/pages/${url}/${url}`,
      })
    },
  }
})
