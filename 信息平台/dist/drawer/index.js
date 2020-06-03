Component({
  externalClasses: ['i-class'],
  properties: {
    visible: {
      type: Boolean,
      value: false
    },

    mask: {
      type: Boolean,
      value: true
    },

    maskClosable: {
      type: Boolean,
      value: true
    },

    mode: {
      type: String,
      value: 'left' // left right
    },
    maxWidth: {
      type: String,
      value: '80'
    }
  },
  data: {},
  methods: {
    handleMaskClick() {
      if (!this.data.maskClosable) {
        return;
      }
      this.triggerEvent('close', {});
    }
  }
});