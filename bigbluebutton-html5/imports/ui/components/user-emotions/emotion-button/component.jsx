import React, { useEffect, useState, useRef,useCallback } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '/imports/ui/components/button/component';
import { makeCall } from '/imports/ui/services/api';
import { injectIntl } from 'react-intl';
import { styles } from './styles';
import VideoPreviewContainer from './videoPreviewContainer';
import { withModalMounter } from '/imports/ui/components/modal/service';
import { ExperiemtModal } from './modals'
import { useInterval,useLoadModels,usePrevious,detectEmotions } from './hooks'
import { useMemo } from 'react';
import { startCase } from "lodash"

const EMOTION_INTERVALL_MILLISECONDS = 20000;

const propTypes = {
  hasVideoStream: PropTypes.bool.isRequired,
};

const sendStart = (type, sendBrowserData) => {
  makeCall('startUserEmotions', Date.now(), type, sendBrowserData ? navigator.userAgent : null);
};

const sendEnd = () => {
  makeCall('endUserEmotions', Date.now());
};

const THRESHOLD = 0.2

const ResultItem = ({id,value})=>{

  return (
    <>
      <div>
        {startCase(id)+":"}
      </div>
      <div>
        {value.toFixed(2)}
        {/* {Math.round(value*100)/100} */}
      </div>
    </>
  )
}

const ExpressionResult = ({expressions})=>{

  const topResult = useMemo(()=>{
    if(expressions === undefined){
      return
    }

    return Object.entries(expressions)
      .filter(([key,value])=>value>=THRESHOLD)
      .slice(0,2)
      .sort((a,b)=>b[1]-a[1])
  },[expressions])

  if(!topResult){
    return <div style={{color: "#fff",width: 100,display: 'flex',alignItems:"center",justifyContent:"center"}}>
        expression 404
    </div>
  }

  return (
    <div style={{color: "#fff",width: 100,display:"grid", gridTemplateColumns: "1fr 1fr"}}>
      {
        topResult.map(([key,value])=><ResultItem key={key} id={key} value={value}/>)
      }
    </div>
  )

}

const EmotionButton = ({
  hasVideoStream,
  mountModal,
}) => {
  const isLoaded = useLoadModels();
  const [isActive, setActive] = useState();
  const [stream, setStream] = useState();
  const [expressions, setExpressions] = useState();
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

  const detectEmotionsHandler = useCallback(async () => {
    let result = undefined
    if (stream) {
      result = await detectEmotions(videoRef.current, 'result-only');
    } else {
      result = await detectEmotions(document.getElementById('userCam'), 'send-video');
    }
    setExpressions(result)
  },[stream]);

  useInterval(detectEmotionsHandler, isRealyActive ? EMOTION_INTERVALL_MILLISECONDS : null);

  const mountVideoPreview = useCallback((sendBrowserStats) => {
    mountModal(<VideoPreviewContainer onChange={(_stream) => {
      sendStart('result-only', sendBrowserStats);
      setStream(_stream);
      setActive(true);
    }}
    />);
  },[mountModal]);

  const handleOnClick = useCallback(async () => {
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
  },[isActive,stream]);

  const onOk = useCallback((sendBrowserStats) => {
    setShowModal(false);
    if (!hasVideoStream) {
      mountVideoPreview(sendBrowserStats);
      return;
    }
    sendStart('send-video', sendBrowserStats);
    setActive(true);
  },[mountVideoPreview,hasVideoStream]);

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
        {isActive && <ExpressionResult expressions={expressions}/>}
    </>
  );
};

EmotionButton.propTypes = propTypes;

export default withModalMounter(injectIntl(EmotionButton));
