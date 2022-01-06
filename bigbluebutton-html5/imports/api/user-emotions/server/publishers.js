import UserEmotions from '/imports/api/user-emotions';
import Users from '/imports/api/users';
import AuthTokenValidation, { ValidationStates } from '/imports/api/auth-token-validation';

const USER_CONFIG = Meteor.settings.public.user;
const ROLE_MODERATOR = USER_CONFIG.role_moderator;

function meetingEmotions() {
  const tokenValidation = AuthTokenValidation.findOne({ connectionId: this.connection.id });

  if (!tokenValidation || tokenValidation.validationStatus !== ValidationStates.VALIDATED) {
    // Logger.warn(`Publishing MeetingTimeRemaining was requested
    // by unauth connection ${this.connection.id}`);
    return UserEmotions.find({ meetingId: '' });
  }

  const { meetingId, userId } = tokenValidation;

  check(meetingId, String);
  check(userId, String);

  const currentUser = Users.findOne({ userId },
    { fields: { role: 1 } });

  const isModerator = currentUser?.role === ROLE_MODERATOR;

  const selector = {
    meetingId: isModerator ? meetingId : '',
  };

  return UserEmotions.find(selector);
}

function publishMeetingEmotions(...args) {
  const boundMeetingEmotions = meetingEmotions.bind(this);
  return boundMeetingEmotions(...args);
}

Meteor.publish('meeting-emotions', publishMeetingEmotions);
