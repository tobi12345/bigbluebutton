import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { makeCall } from '/imports/ui/services/api';
import { injectIntl } from 'react-intl';
import { debounce } from 'lodash';
import * as faceapi from 'face-api.js';
import { styles } from './styles';
import VideoPreviewContainer from './videoPreviewContainer';
import { withModalMounter } from '/imports/ui/components/modal/service';

const JOIN_VIDEO_DELAY_MILLISECONDS = 500;
const EMOTION_INTERVALL_MILLISECONDS = 2000;
let detector = null;

const propTypes = {
  hasVideoStream: PropTypes.bool.isRequired,
};

const useInterval = (callback, delay) => {
  const savedCallback = useRef(() => undefined);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    console.log('reset');
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

const useLoadModels = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/html5client/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/html5client/models'),
    ])
      .catch((error) => console.log('Error Loading faceApiJs Models', error))
      .then(() => {
        setIsLoaded(true);
        detector = new faceapi.TinyFaceDetectorOptions();
      });
  }, [setIsLoaded]);

  return isLoaded;
};

const detectEmotions = (element) => {
  console.time('detection start');
  if (!detector) {
    return;
  }
  const now = Date.now();
  faceapi
    .detectSingleFace(element, detector)
    .withFaceExpressions()
    .then((detections) => {
      console.timeEnd('detection start');
      console.log(detections);
      const expressions = detections?.expressions;
      if (expressions) {
        makeCall('setUserEmotions', expressions, now);
      }
    })
    .catch((error) => console.log(error));
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const EmotionButton = ({
  hasVideoStream,
  mountModal,
}) => {
  const isLoaded = useLoadModels();
  const [isActive, setActive] = useState();
  const [stream, setStream] = useState();
  const videoRef = useRef();
  const lastHasVideoStream = usePrevious(hasVideoStream);

  useEffect(() => {
    videoRef.current = document.createElement('video');
    videoRef.current.setAttribute('autoplay', 'muted');
    videoRef.current.width = 400;
    videoRef.current.height = 400;
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (!hasVideoStream && !stream && isActive) {
      setActive(false);
    }
  }, [hasVideoStream, stream, isActive]);

  useEffect(() => {
    if (!hasVideoStream && lastHasVideoStream && isActive && stream) {
      setStream(null);
      setActive(false);
    }
  }, [hasVideoStream, lastHasVideoStream, isActive, stream]);

  const isRealyActive = isActive && isLoaded && (hasVideoStream || stream);

  console.log({
    stream: !!stream, isActive, isLoaded, isRealyActive,
  });

  const detectEmotionsHandler = () => {
    if (stream) {
      detectEmotions(videoRef.current);
    } else {
      detectEmotions(document.getElementById('userCam'));
    }
  };

  useInterval(detectEmotionsHandler, isRealyActive ? EMOTION_INTERVALL_MILLISECONDS : null);

  const mountVideoPreview = () => {
    mountModal(<VideoPreviewContainer onChange={(_stream) => {
      setStream(_stream);
      setActive(true);
    }}
    />);
  };

  const handleOnClick = debounce(async () => {
    if (!hasVideoStream && !isActive) {
      mountVideoPreview();
      return;
    }
    if (stream) {
      stream.getTracks().forEach((track) => {
        console.log(track);
        track.stop();
      });
      setStream(null);
    }
    setActive((active) => !active);
  }, JOIN_VIDEO_DELAY_MILLISECONDS);

  return (
    <>
      <video
        muted
        playsInline
        // ref={videoRef}
        id="emotion-cam"
        style={{
          position: 'fixed', top: 0, width: 400, height: 400, zIndex: 10000, visibility: 'hidden',
        }}
        autoPlay
      />
      <Button
        label="emotion button"
        className={cx({
          [styles.btn]: !isActive,
        })}
        onClick={handleOnClick}
        hideLabel
        color="primary"
        icon="happy"
        disabled={!isLoaded}
        size="lg"
        circle
      />
    </>
  );
};

EmotionButton.propTypes = propTypes;

export default withModalMounter(injectIntl(EmotionButton));
