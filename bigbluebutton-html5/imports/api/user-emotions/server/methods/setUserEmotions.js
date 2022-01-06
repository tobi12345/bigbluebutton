import UserEmotions from '/imports/api/user-emotions';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function setUserEmotions(expressions, timestamp) {
  const { meetingId, requesterUserId: userId } = extractCredentials(this.userId);

  check(meetingId, String);
  check(userId, String);
  check(expressions, Object);
  check(timestamp, Number);

  const selector = {
    userId,
    meetingId,
  };

  const currentUserEmotions = UserEmotions.findOne(selector);
  if (currentUserEmotions) {
    const modifier = {
      $push: {
        data: { timestamp, expressions },
      },
    };
    UserEmotions.update(selector, modifier);
  } else {
    UserEmotions.insert({
      ...selector,
      data: [{ timestamp, expressions }],
    });
  }
}
