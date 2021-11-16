import UserEmotions from '/imports/api/user-emotions';
import { extractCredentials } from '/imports/api/common/server/helpers';

function meetingEmotions() {
  if (!this.userId) {
    return undefined;
  }
  const { meetingId, requesterUserId } = extractCredentials(this.userId);

  check(meetingId, String);
  check(requesterUserId, String);

  const selector = {
    meetingId,
  };

  return UserEmotions.find(selector);
}

function publishMeetingEmotions(...args) {
  const boundMeetingEmotions = meetingEmotions.bind(this);
  return boundMeetingEmotions(...args);
}

Meteor.publish('meeting-emotions', publishMeetingEmotions);
