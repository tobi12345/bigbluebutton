import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { injectIntl } from 'react-intl';
import { withModalMounter } from '/imports/ui/components/modal/service';
import VideoPreviewContainer from '/imports/ui/components/video-preview/container';
import EmotionButtonButton from './component';
import VideoService from '../service';

const EmotionButtonOptionsContainer = (props) => {
  const {
    hasVideoStream,
    disableReason,
    intl,
    mountModal,
    ...restProps
  } = props;

  const mountVideoPreview = () => { mountModal(<VideoPreviewContainer />); };

  return (
    <EmotionButtonButton {...{
      mountVideoPreview, hasVideoStream, disableReason, ...restProps,
    }}
    />
  );
};

export default withModalMounter(injectIntl(withTracker(() => ({
  hasVideoStream: VideoService.hasVideoStream(),
  disableReason: VideoService.disableReason(),
}))(EmotionButtonOptionsContainer)));
