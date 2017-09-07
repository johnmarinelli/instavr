import AFRAME from 'aframe';
import 'aframe-look-at-component';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'babel-polyfill';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import ComponentLoader from './components/aframe/ComponentLoader';
import setInstagramWindows from './LayoutHelper';

let Instajam = require('instajam');

import {initInstajam} from './initInstajam';

// load custom components
ComponentLoader(AFRAME);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: null, 
      igWindows: null,
      igVideoAssets: null
    };
  }

  componentDidMount () {
    this.setState((prevState) => {
      let api = initInstajam(Instajam);
      return {api: api};
    });

  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.api !== this.state.api) {
      let { api } = this.state;

      api.user.self.media((res) => {
        let { windows, videos } = setInstagramWindows(res.data.slice(0, 5));
        this.setState({igWindows: windows, igVideoAssets: videos});
      });
    }
  }


  render () {
    let { igVideoAssets, igWindows }= this.state;

    let cursor = (
      <Entity 
        primitive="a-cursor" 
        animation__click={{property: 'scale', startEvents: 'click', from: '0.1 0.1 0.1', to: '1 1 1', dur: 150}}
        raycaster="far:10"
      />
    )

    return (
      <Scene>
        <a-assets>
          <audio id="click-sound" src="https://cdn.aframe.io/360-image-gallery-boilerplate/audio/click.ogg"></audio>
          <video id="placeholdervideo" src="http://techslides.com/demos/sample-videos/small.mp4"></video>
          <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg"/>
          <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg"/>
          <img id="placeholderimage" src="image/500x500.png"/>
          {igVideoAssets}
        </a-assets>

        <Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" height="100" width="100"/>
        <Entity primitive="a-light" type="ambient" color="#445451"/>
        <Entity primitive="a-light" type="point" intensity="2" position="2 4 4"/>
        <Entity primitive="a-sky" height="2048" radius="30" src="#skyTexture" theta-length="90" width="2048"/>
        <Entity particle-system={{preset: 'snow', particleCount: 2000}}/>
        {/*<Entity text={{value: 'VR Instagram viewer', align: 'center'}} position={{x: 0, y: 2, z: -1}}/>*/}
        <Entity position={{x:0, y:0, z:0}} id="igwindows">
          {igWindows ? igWindows : ''}
        </Entity>

        <Entity id="player" primitive="a-camera">
          {cursor}
        </Entity>
      </Scene>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector('#sceneContainer'));
