import React, { useMemo } from 'react';
import Auth from '/imports/ui/services/auth';
import UserEmotions from '/imports/api/user-emotions';
import { withTracker } from 'meteor/react-meteor-data';
import EmotionResult from '/imports/ui/components/user-emotions/emotion-result/component';
import _ from 'lodash';

const EmotionAvgResult = ({
  userEmotions,
}) => {
  console.log(userEmotions);

  const meanResult = useMemo(() => ({
    angry: _.meanBy(userEmotions, ({ data }) => data[data.length - 1].expressions.angry),
    disgusted: _.meanBy(userEmotions, ({ data }) => data[data.length - 1].expressions.disgusted),
    fearful: _.meanBy(userEmotions, ({ data }) => data[data.length - 1].expressions.fearful),
    neutral: _.meanBy(userEmotions, ({ data }) => data[data.length - 1].expressions.neutral),
    happy: _.meanBy(userEmotions, ({ data }) => data[data.length - 1].expressions.happy),
    sad: _.meanBy(userEmotions, ({ data }) => data[data.length - 1].expressions.sad),
    surprised: _.meanBy(userEmotions, ({ data }) => data[data.length - 1].expressions.surprised),
  }), [userEmotions]);

  return (
    <div>
      <h3>AVG:</h3>
      <EmotionResult emotionResult={meanResult} />
    </div>
  );
};

const withData = withTracker(() => ({
  userEmotions: UserEmotions
    .find({ meetingId: Auth.meetingID })
    .fetch(),
}));

export default withData(EmotionAvgResult);
