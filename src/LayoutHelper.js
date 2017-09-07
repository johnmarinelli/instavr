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

  let createPanel = (props, cb) => {
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

  let createCarousel = (post, props, cb) => {
    let mediaPanels = [];
    let parentKey = totalMediaIndex++;

    // create parent Entity that will hold carousel items
    // see https://medium.com/immersion-for-the-win/relative-positioning-in-a-frame-d839fc0e3249
    // for more info on AFRAME positioning
    post.carousel_media.forEach((media, carouselIndex) => {

      let childProps = JSON.parse(JSON.stringify(props));
      childProps.position.x = 0.0;
      childProps.position.y = 0.0;
      childProps.position.z = -0.2 * carouselIndex;
      
      if (media.images) {
        setImageEntity(childProps, media);
      }
      else if (media.videos) {
        setVideoEntity(childProps, media);
      }
      let panel = createPanel(childProps, (panel) => {
        mediaPanels.push(panel);
      });
    });

    let carousel = (
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

      createPanel(props, (panel) => {
        windows.push(panel);
      });
    }
    else if ('carousel' === type) {
      createCarousel(post, props, (carousel) => {
        windows.push(carousel);
      });
    }
  })

  return {
    windows: windows,
    videos: videos
  };
};
