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
      igVideoAssets: null,
      sky: 'darkSky'
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
        const { windows, videos } = setInstagramWindows(res.data.slice(0, 5));
        this.setState({igWindows: windows, igVideoAssets: videos});
      });
    }
  }

  render () {
    const { igVideoAssets, igWindows }= this.state;

    const cursor = (
      <Entity 
        primitive="a-cursor" 
        animation__click={{property: 'scale', startEvents: 'click', from: '0.1 0.1 0.1', to: '1 1 1', dur: 150}}
        raycaster="far:10"
      />
    )

    const extraEntities = this.state.sky === 'darkSky' ? [
      (<Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" height="100" width="100"/>),
      (<Entity particle-system={{preset: 'snow', particleCount: 2000}}/>),
      (<Entity primitive="a-light" type="ambient" color="#445451"/>),
      (<Entity primitive="a-light" type="point" intensity="2" position="2 4 4"/>)
    ] : null;

    const button = (
      <Entity primitive="a-plane" position="2.5 2 -1.5" height="2" width="2" color="#e21d2d" rotation="0 -50 0" scene-change-component>
        <Entity text="value: Change Scene; align: center" scale="5 5 5"/>
      </Entity>
    );

    return (
      <Scene>
        <a-assets>
          <audio id="click-sound" src="https://cdn.aframe.io/360-image-gallery-boilerplate/audio/click.ogg"></audio>
          <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg"/>
          <img id="houseBackground" src="https://cdn.glitch.com/e6225ccd-c32e-4cf8-b039-e78814a8cb78%2Fbg-3.jpg" crossOrigin="anonymous"/>
          <img id="darkSky" src="https://cdn.aframe.io/a-painter/images/sky.jpg" crossorigin="anonymous"/>
          <img id="placeholderimage" src="image/500x500.png"/>
          {igVideoAssets}
        </a-assets>

        {extraEntities}

        <Entity id="background" primitive="a-sky" src={`#${this.state.sky}`}/>
        <Entity position={{x:0, y:0, z:0}} id="igwindows">
          {igWindows ? igWindows : ''}
        </Entity>

        <Entity id="player" primitive="a-camera">
          {cursor}
        </Entity>

        {button}
      </Scene>
    );
  }
}

ReactDOM.render(<App/>, document.querySelector('#sceneContainer'));
