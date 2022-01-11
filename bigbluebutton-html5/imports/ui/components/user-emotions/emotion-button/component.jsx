import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { makeCall } from '/imports/ui/services/api';
import { injectIntl } from 'react-intl';
import * as faceapi from 'face-api.js';
import { styles } from './styles';
import VideoPreviewContainer from './videoPreviewContainer';
import { withModalMounter } from '/imports/ui/components/modal/service';
import Modal from '/imports/ui/components/modal/simple/component';

const EMOTION_INTERVALL_MILLISECONDS = 20000;
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

const useLoadModels = () => {
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

const detectEmotions = (element, type) => {
  // console.time('detection start');
  if (!detector) {
    return;
  }
  const now = Date.now();
  faceapi
    .detectSingleFace(element, detector)
    .withFaceExpressions()
    .then((detections) => {
      // console.timeEnd('detection start');
      // console.log(detections);
      makeCall('setUserEmotions', detections, now, Date.now() - now, type);
    })
    .catch((error) => console.log(error));
};

const sendStart = (type, sendBrowserData) => {
  makeCall('startUserEmotions', Date.now(), type, sendBrowserData ? navigator.userAgent : null);
};

const sendEnd = () => {
  makeCall('endUserEmotions', Date.now());
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const ExperiemtModal = ({ onDismiss, onOk }) => {
  const [checked, setChecked] = useState(false);

  return (
    <Modal
      dismiss={{ callback: onDismiss }}
      title="Emotion Recognition Demo"
    >
      <div>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10, margin: '10px 10px 15px 0px', fontSize: 17,
        }}
        >
          <div>
            <div style={{ fontWeight: 'bold' }}>What are we doing?</div>
            <div style={{ fontSize: 16 }}>
              We analyze your emotions on your device using your webcam and machine learning 
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>What data are we collecting?</div>
            <div style={{ fontSize: 16 }}>
            every X seconds, userID (no names!), timestamps, emotion results and user agent (optionaly)
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>Who has access to the collected data?</div>
            <div style={{ fontSize: 16 }}>
              Only me (Tobias Klesel),
              but Prof. Dr.-Ing. Jörg Ott as my master thesis advisor
              will also see averaged and anonymized data
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="sendPCStats" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="checkbox"
              id="sendPCStats"
              onChange={(e) => setChecked(e.target.checked)}
              checked={checked}
            />
            <span aria-hidden>Send Browser Information (optional, but would realy help)</span>
          </label>
        </div>
        <div style={{ height: 10 }} />
        <div>
          <Button
            label="Start Emotion Recognition"
            className={styles.btn}
            onClick={() => onOk(checked)}
            color="primary"
            size="lg"
          />
        </div>
      </div>
    </Modal>
  );
};

const EmotionButton = ({
  hasVideoStream,
  mountModal,
}) => {
  const isLoaded = useLoadModels();
  const [isActive, setActive] = useState();
  const [stream, setStream] = useState();
  const [showModal, setShowModal] = useState(false);
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
      sendEnd();
    }
  }, [hasVideoStream, stream, isActive]);

  useEffect(() => {
    if (!hasVideoStream && lastHasVideoStream && isActive && stream) {
      setStream(null);
      setActive(false);
      sendEnd();
    }
  }, [hasVideoStream, lastHasVideoStream, isActive, stream]);

  const isRealyActive = isActive && isLoaded && (hasVideoStream || stream);

  const detectEmotionsHandler = () => {
    if (stream) {
      detectEmotions(videoRef.current, 'result-only');
    } else {
      detectEmotions(document.getElementById('userCam'), 'send-video');
    }
  };

  useInterval(detectEmotionsHandler, isRealyActive ? EMOTION_INTERVALL_MILLISECONDS : null);

  const mountVideoPreview = (sendBrowserStats) => {
    mountModal(<VideoPreviewContainer onChange={(_stream) => {
      sendStart('result-only', sendBrowserStats);
      setStream(_stream);
      setActive(true);
    }}
    />);
  };

  const handleOnClick = async () => {
    if (!isActive) {
      setShowModal(true);
      return;
    }

    setActive(false);
    sendEnd();
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  };

  const onOk = (sendBrowserStats) => {
    setShowModal(false);
    if (!hasVideoStream) {
      mountVideoPreview(sendBrowserStats);
      return;
    }
    sendStart('send-video', sendBrowserStats);
    setActive(true);
  };

  return (
    <>
        {showModal && (
        <ExperiemtModal
          onDismiss={() => setShowModal(false)}
          onOk={onOk}
        />
        )}
        <Button
          label={(isActive?"End":"Start")+" Emotion Recognition"}
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
