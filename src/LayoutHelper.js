import AFRAME from 'aframe';
import React from 'react';
import ReactDOM from 'react-dom';
import 'aframe-look-at-component';
import 'aframe-animation-component';
import {Entity, Scene} from 'aframe-react';

// `posts` is an array returned from 
// Instajam's response.data
export default function setInstagramWindows(posts) {
  let windows = [];
  let videos = [];
  let totalMediaIndex = 0;
  const rows = 5, cols = 4;

  // mutates `props`
  const createVideoAsset = (props, post) => {
    props.primitive = 'a-image';
    props.videoAssetId = `video_${videos.length}`;
    props.src = post.images.thumbnail.url;
    props.onClickSrc = post.videos.standard_resolution.url;

    // create video asset
    // playsinline attribute is for iOs
    const videoAsset = (
      <video id={props.videoAssetId} src={props.videoSrc} playsInline muted key={videos.length}></video>
    );
    return videoAsset;
  };

  const setEntity = (post, props) => {

    // mutates `props`
    const setImageEntity = (props, post) => {
      props.primitive = 'a-image';
      props.src = post.images.thumbnail.url;
      props.onClickSrc = post.images.standard_resolution.url;
    };

    // mutates `props`
    const setVideoEntity = (props, post) => {
      const videoAsset = createVideoAsset(props, post);
      videos.push(videoAsset);
    };

    const propsSetters = {
      video: setVideoEntity,
      image: setImageEntity
    };

    if (['video', 'image'].indexOf(post.type) > -1) {
      propsSetters[post.type](props, post);
    }
  };

  const createPanel = (post, props, cb) => {
    setEntity(post, props);

    let animateTo = Object.assign({}, props.scale);
    animateTo.x += 1.5;
    animateTo.y += 1.5;
    animateTo.z += 1.5;

    const animationComponentTo = {
      property: 'scale',
      from: props.scale,
      to: animateTo,
      startEvents: 'cursor-hover-in'
    };

    let animationComponentFrom = Object.assign({}, animationComponentTo);
    animationComponentFrom.startEvents = 'cursor-hover-out';
    animationComponentFrom.dir = 'reverse';

    const cursorListenerComponent = {
      'hi-res': props.onClickSrc
    }

    const igWindow = (
      <Entity 
        primitive={props.primitive} 
        src={props.src} 
        position={props.position} 
        scale={props.scale} 
        animation__to={animationComponentTo}
        animation__from={animationComponentFrom}
        look-at="0 0 0"
        key={totalMediaIndex++}
        cursor-listener={cursorListenerComponent}
        />
    );
    cb(igWindow);
    return igWindow;
  };

  const createCarousel = (post, props, cb) => {
    let mediaPanels = [];
    const parentKey = totalMediaIndex++;

    // create parent Entity that will hold carousel items
    // see https://medium.com/immersion-for-the-win/relative-positioning-in-a-frame-d839fc0e3249
    // for more info on AFRAME positioning
    post.carousel_media.forEach((media, carouselIndex) => {

      let childProps = JSON.parse(JSON.stringify(props));
      childProps.position.x = 0.0;
      childProps.position.y = 0.0;
      childProps.position.z = -0.2 * carouselIndex;

      const panel = createPanel(media, childProps, (panel) => {
        mediaPanels.push(panel);
      });
    });

    const carousel = (
      <Entity 
        position={props.position}
        key={parentKey}
        look-at="0 0 0"
      >
        {mediaPanels}
      </Entity>
    );

    cb(carousel);
    return carousel;
  };
  
  posts.forEach((post, index) => {
    const type = post.type;
    let props = {primitive: '', src: '', position: null, scale: {x: 1.9, y:1,z:1}};
    const col = index % cols;
    const row = index % rows;

    const seedPosition = { x: (2.5 * col) - 5.0, y: row + 1, z: -2.5 };
    props.position = seedPosition;

    const fns = {
      video: createPanel,
      image: createPanel,
      carousel: createCarousel
    };

    const addToWindows = (wdw) => {
      windows.push(wdw);
    };

    const fn = fns[type];
    fn(post, props, addToWindows);

  })

  return {
    windows: windows,
    videos: videos
  };
};
