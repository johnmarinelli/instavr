module.exports = function SceneChangeComponent(AFRAME, componentName) {
  AFRAME.registerComponent(componentName, {

    onClickListener: function (event) {
      let sky = this.el.sceneEl.querySelector('#background');
      sky.setAttribute('src', '#houseBackground');
    },

    init: function () {
      this.onClickListener = this.onClickListener.bind(this);
      this.el.addEventListener('click', this.onClickListener);
    },

    remove: function () {
      this.el.removeEventListener('click', this.onClickListener);
    }
  })
};
