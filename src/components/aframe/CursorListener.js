module.exports = function CursorListener(AFRAME, componentName) {
  AFRAME.registerComponent(componentName, {
    schema: {
      'hi-res': {
        default: '',
      }
    },
    
    init: function () {
      let COLORS = ['red', 'green', 'blue'];
      let self = this;

      this.el.addEventListener('animationbegin', (e) => {
      });
      this.el.addEventListener('animationcomplete', (e) => {
      });

      this.el.addEventListener('stateadded', function (e) {
        if (e.detail.state === 'cursor-hovered') {
          self.el.emit('cursor-hover-in');
        }
      });

      this.el.addEventListener('stateremoved', function (e) {
        if (e.detail.state === 'cursor-hovered') {
          self.el.emit('cursor-hover-out');
        }
      });

      this.el.addEventListener('click', function (e) {
        if (self.el.tagName === 'A-IMAGE' && self.el.getAttribute('src') !== self.data['hi-res']) {
          self.el.setAttribute('src', self.data['hi-res']);
        }
      });
    },

    remove: function () {
      this.el.removeEventListener('stateadded');
      this.el.removeEventListener('stateremoved');
      this.el.removeEventListener('animationbegin');
      this.el.removeEventListener('animationcomplete');
    }


  });
};
