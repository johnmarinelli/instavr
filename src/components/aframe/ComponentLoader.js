import CursorListener from './CursorListener';

// register all custom AFRAME components here
module.exports = function ComponentLoader(AFRAME) {
  CursorListener(AFRAME, 'cursor-listener');
};
