import UserEmotions from '/imports/api/user-emotions';
import { extractCredentials } from '/imports/api/common/server/helpers';

export default function setUserEmotions(expressions) {
  console.log('setUserEmotions');
  console.log(expressions);
  const { meetingId, requesterUserId: userId } = extractCredentials(this.userId);

  check(meetingId, String);
  check(userId, String);
  check(expressions, Object);

  const selector = {
    userId,
    meetingId,
  };

  const modifier = {
    $set: {
      data: expressions,
    },
  };

  const currentUserEmotions = UserEmotions.findOne(selector);
  if (currentUserEmotions) {
    UserEmotions.update(selector, modifier);
  } else {
    UserEmotions.insert({
      ...selector,
      data: expressions,
    });
  }
}
