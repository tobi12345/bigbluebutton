import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { injectIntl } from 'react-intl';
import { debounce } from 'lodash';
import * as faceapi from 'face-api.js';
import { styles } from './styles';

const JOIN_VIDEO_DELAY_MILLISECONDS = 500;

const propTypes = {
  hasVideoStream: PropTypes.bool.isRequired,
};

const useLoadModels = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/html5client/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/html5client/models'),
    ]).catch((error) => console.log('Error Loading faceApiJs Models', error)).then(() => setIsLoaded(true));
  }, [setIsLoaded]);

  return isLoaded;
};

const EmotionButton = ({
  hasVideoStream,
}) => {
  const isLoaded = useLoadModels();

  const handleOnClick = debounce(async () => {
    if (isLoaded && hasVideoStream) {
      try {
        const element = document.getElementById('userCam');
        const detections = await faceapi
          .detectSingleFace(element, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        console.log(detections);
      } catch (error) {
        console.log(error);
      }
    }
  }, JOIN_VIDEO_DELAY_MILLISECONDS);

  return (
    <Button
      label="emotion button"
      data-test={hasVideoStream ? 'leaveVideo' : 'joinVideo'}
      className={cx(hasVideoStream || styles.btn)}
      onClick={handleOnClick}
      hideLabel
      color={hasVideoStream ? 'primary' : 'default'}
      icon={hasVideoStream ? 'video' : 'video_off'}
      ghost={!hasVideoStream}
      disabled={!hasVideoStream || !isLoaded}
      size="lg"
      circle
    />
  );
};

EmotionButton.propTypes = propTypes;

export default injectIntl(memo(EmotionButton));
