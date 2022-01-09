import EmotionResult from '/imports/ui/components/user-emotions/emotion-result/component';
import { withTracker } from 'meteor/react-meteor-data';
import UserEmotions from '/imports/api/user-emotions';

const withData = withTracker(({ user }) => ({
  emotionResult: UserEmotions
    .findOne({ meetingId: user.meetingId, userId: user.userId })?.data,
  mode: 'max',
  style: {
    width: '100%',
  },
}));

export default withData(EmotionResult);
