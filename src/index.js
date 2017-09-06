import AFRAME from 'aframe';
import 'aframe-look-at-component';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'aframe-animation-component';
import 'babel-polyfill';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import ComponentLoader from './components/aframe/ComponentLoader';

let Instajam = require('instajam');

import {initInstajam} from './initInstajam';

// load custom components
ComponentLoader(AFRAME);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'red', 
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
        this.setInstagramWindows(res.data.slice(0, 5));
      });
    }
  }

  changeColor() {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  // `posts` is an array returned from 
  // Instajam's response.data
  setInstagramWindows = (posts) => {
    let windows = new Array(posts.length).fill(null);
    let videos = [];
    let rows = 5, cols = 4;

    // mutates `props`
    let createVideoAsset = (props, post) => {
      props.primitive = 'a-image';
      props.videoAssetId = `video_${videos.length}`;
      props.src = post.images.thumbnail.url;
      props.onClickSrc = post.videos.standard_resolution.url;

      // create video asset
      // playsinline attribute is for iOs
      let videoAsset = (
        <video id={props.videoAssetId} src={props.videoSrc} playsInline muted key={videos.length}></video>
      );
      return videoAsset;
    };

    // mutates `props`
    let setImageEntity = (props, post) => {
      props.primitive = 'a-image';
      props.src = post.images.thumbnail.url;
      props.onClickSrc = post.images.standard_resolution.url;
    };

    // mutates `props`
    let setVideoEntity = (props, post) => {
      let videoAsset = createVideoAsset(props, post);
      videos.push(videoAsset);
    };

    let createPanel = (props, index) => {
      let animateTo = Object.assign({}, props.scale);
      animateTo.x += 1.5;
      animateTo.y += 1.5;
      animateTo.z += 1.5;

      let animationComponentTo = {
        property: 'scale',
        from: props.scale,
        to: animateTo,
        startEvents: 'cursor-hover-in'
      };

      let animationComponentFrom = Object.assign({}, animationComponentTo);
      animationComponentFrom.startEvents = 'cursor-hover-out';
      animationComponentFrom.dir = 'reverse';

      let cursorListenerComponent = {
        'hi-res': props.onClickSrc
      }

      let igWindow = (
        <Entity 
          primitive={props.primitive} 
          src={props.src} 
          position={props.position} 
          scale={props.scale} 
          key={index}
          animation__to={animationComponentTo}
          animation__from={animationComponentFrom}
          look-at="0 0 0"
          cursor-listener={cursorListenerComponent}
          />
      );
      windows[index] = igWindow;
      return igWindow;
    };
    
    let totalMediaIndex = 0;
    posts.forEach((post, index) => {
      let type = post.type;
      let props = {primitive: '', src: '', position: null, scale: {x: 1.9, y:1,z:1}};
      let col = index % cols;
      let row = index % rows;

      let seedPosition = { x: (2.5 * col) - 5.0, y: row + 1, z: -2.5 };
      props.position = seedPosition;

      if ('video' === type || 'image' === type) {
        switch (type) {
          case 'video':
            setVideoEntity(props, post);
            break;
          case 'image':
            setImageEntity(props, post);
            break;
          default: 
            break;
        }

        createPanel(props, totalMediaIndex++);
      }
      else if ('carousel' === type) {
        post.carousel_media.forEach((media, carouselIndex) => {

          let childProps = JSON.parse(JSON.stringify(props));

          childProps.position.x += 0.2 * carouselIndex;
          childProps.position.z -= 0.2 * carouselIndex;
          
          if (media.images) {
            setImageEntity(childProps, media);
            createPanel(childProps, totalMediaIndex++);
          }
          else if (media.videos) {
            setVideoEntity(childProps, media);
            createPanel(childProps, totalMediaIndex++);
          }
        });
      }
    })

    this.setState({igWindows: windows, igVideoAssets: videos});
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
        <Entity text={{value: 'VR Instagram viewer', align: 'center'}} position={{x: 0, y: 2, z: -1}}/>
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
