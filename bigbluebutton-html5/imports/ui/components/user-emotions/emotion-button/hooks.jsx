import React, { useEffect, useRef,useState } from 'react';
import * as faceapi from 'face-api.js';
import { makeCall } from '/imports/ui/services/api';

let detector = null;

export const useInterval = (callback, delay) => {
    const savedCallback = useRef(() => undefined);
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      const tick = () => {
        savedCallback.current();
      };
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
      return undefined;
    }, [delay]);
  };


const sendModelLoad = (start,duration) => {
    makeCall('modelLoadTime', start,duration);
};
  
export const useLoadModels = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const now = Date.now()
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/html5client/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/html5client/models'),
        ])
        .catch((error) => console.log('Error Loading faceApiJs Models', error))
        .then(() => {
            sendModelLoad(now,Date.now() - now)
            setIsLoaded(true);
            detector = new faceapi.TinyFaceDetectorOptions();
        });
    }, [setIsLoaded]);

    return isLoaded;
};
  

export const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export const detectEmotions = async (element, type) => {
    if (!detector) {
      return;
    }
    const now = Date.now();
    try{
        const detections = await faceapi
            .detectSingleFace(element, detector)
            .withFaceExpressions()
        makeCall('setUserEmotions', detections, now, Date.now() - now, type);

        return detections?.expressions
    }catch(err){
        console.log(err)
    }
  };