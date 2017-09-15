import CursorListener from './CursorListener';
import SceneChangeComponent from './SceneChangeComponent';

// register all custom AFRAME components here
module.exports = function ComponentLoader(AFRAME) {
  CursorListener(AFRAME, 'cursor-listener');
  SceneChangeComponent(AFRAME, 'scene-change-component');
};
