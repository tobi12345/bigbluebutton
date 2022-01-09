import React from 'react';
import { withModalMounter } from '/imports/ui/components/modal/service';
import { withTracker } from 'meteor/react-meteor-data';
import Users from '/imports/api/users';
import Meetings from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import Service from '../../video-preview/service';
import VideoPreview from '/imports/ui/components/video-preview/component';
import VideoService from '../../video-provider/service';
import PreviewService from '/imports/ui/components/video-preview/service';

const VideoPreviewContainer = (props) => <VideoPreview {...props} />;

const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;

const isCamLocked = () => {
  const meeting = Meetings.findOne({ meetingId: Auth.meetingID },
    { fields: { 'lockSettingsProps.disableCam': 1 } });
  const user = Users.findOne({ meetingId: Auth.meetingID, userId: Auth.userID },
    { fields: { locked: 1, role: 1 } });

  if (meeting.lockSettingsProps !== undefined) {
    if (user.locked && user.role !== ROLE_MODERATOR) {
      return meeting.lockSettingsProps.disableCam;
    }
  }
  return false;
};

export default withModalMounter(withTracker(({ mountModal, onChange }) => ({
  startSharing: (deviceId) => {
    mountModal(null);
    const bbbStream = PreviewService.getStream(deviceId);
    if (bbbStream && bbbStream.originalStream) {
      onChange(bbbStream.originalStream);
      return;
    }
    navigator.mediaDevices.getUserMedia({
      video: { deviceId },
    })
      .then(onChange)
      .catch((err) => {
      /* handle the error */
        console.log(err);
      }).finally(() => {
        mountModal(null);
      });
  },
  stopSharing: () => {
    mountModal(null);
  },
  sharedDevices: VideoService.getSharedDevices(),
  isCamLocked: isCamLocked(),
  closeModal: () => mountModal(null),
  webcamDeviceId: Service.webcamDeviceId(),
  hasVideoStream: VideoService.hasVideoStream(),
}))(VideoPreviewContainer));
