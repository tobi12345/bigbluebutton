import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { makeCall } from '/imports/ui/services/api';
import { injectIntl } from 'react-intl';
import { debounce } from 'lodash';
import * as faceapi from 'face-api.js';
import { styles } from './styles';

const JOIN_VIDEO_DELAY_MILLISECONDS = 500;
const EMOTION_INTERVALL_MILLISECONDS = 2000;

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
      .then(() => setIsLoaded(true));
  }, [setIsLoaded]);

  return isLoaded;
};

const detectEmotions = () => {
  const element = document.getElementById('userCam');
  faceapi
    .detectSingleFace(element, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions()
    .then((detections) => {
      const expressions = detections?.expressions;
      if (expressions) {
        makeCall('setUserEmotions', expressions);
      }
    })
    .catch((error) => console.log(error));
};

const EmotionButton = ({
  hasVideoStream,
}) => {
  const isLoaded = useLoadModels();
  const [isActive, setActive] = useState();

  const isRealyActive = isActive && isLoaded && hasVideoStream;
  useInterval(detectEmotions, isRealyActive ? EMOTION_INTERVALL_MILLISECONDS : null);

  const handleOnClick = debounce(async () => {
    setActive((active) => !active);
  }, JOIN_VIDEO_DELAY_MILLISECONDS);

  return (
    <Button
      label="emotion button"
      data-test={hasVideoStream ? 'leaveVideo' : 'joinVideo'}
      className={cx({
        [styles.btn]: !isActive,
      })}
      onClick={handleOnClick}
      hideLabel
      color={hasVideoStream ? 'primary' : 'default'}
      icon="happy"
      ghost={!hasVideoStream}
      disabled={!hasVideoStream || !isLoaded}
      size="lg"
      circle
    />
  );
};

EmotionButton.propTypes = propTypes;

export default injectIntl(EmotionButton);
