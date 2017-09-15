module.exports = function CursorListener(AFRAME, componentName) {
  AFRAME.registerComponent(componentName, {
    schema: {
      'hi-res': {
        default: '',
      }
    },

    stateToEvent: {
      added: {
        'cursor-hovered': 'cursor-hover-in'
      },
      removed: {
        'cursor-hovered': 'cursor-hover-out'
      }
    },

    /*
     * Event listeners
     */
    animationBeginListener: function (event) { console.log(event) },
    animationEndListener: function (event) { console.log(event) },

    stateAddedListener: function (event) {
      let eventToEmit = this.stateToEvent.added[event.detail.state];
      if (eventToEmit) this.el.emit(eventToEmit);
    },
    
    stateRemovedListener: function (event) {
      let eventToEmit = this.stateToEvent.removed[event.detail.state];
      if (eventToEmit) this.el.emit(eventToEmit);
    },

    onClickListener: function (event) {
      if (this.el.tagName === 'A-IMAGE' && this.el.getAttribute('src') !== this.data['hi-res']) {
        this.el.setAttribute('src', this.data['hi-res']);
      }
    },
    
    init: function () {
      this.animationBeginListener = this.animationBeginListener.bind(this);
      this.animationEndListener = this.animationEndListener.bind(this);
      this.stateAddedListener = this.stateAddedListener.bind(this);
      this.stateRemovedListener = this.stateRemovedListener.bind(this);
      this.onClickListener = this.onClickListener.bind(this);

      this.el.addEventListener('animationbegin', this.animationBeginListener);
      this.el.addEventListener('animationcomplete', this.animationEndListener);
      this.el.addEventListener('stateadded', this.stateAddedListener);
      this.el.addEventListener('stateremoved', this.stateRemovedListener);
      this.el.addEventListener('click', this.onClickListener);
    },

    remove: function () {
      this.el.removeEventListener('stateadded', this.stateAddedListener);
      this.el.removeEventListener('stateremoved', this.stateRemovedListener);
      this.el.removeEventListener('animationbegin', this.animationBeginListener);
      this.el.removeEventListener('animationcomplete', this.animationEndListener);
      this.el.removeEventListener('click', this.onClickListener);
    }
  });
};
