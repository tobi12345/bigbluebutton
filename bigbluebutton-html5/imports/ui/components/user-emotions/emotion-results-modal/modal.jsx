import React from 'react';
import _ from 'lodash';
import Modal from '/imports/ui/components/modal/simple/component';
import { withTracker } from 'meteor/react-meteor-data';
import UserEmotions from '/imports/api/user-emotions';
import Auth from '/imports/ui/services/auth';
import Meetings from '/imports/api/meetings';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip,
} from 'recharts';
import { EMOTION_INTERVALL_MILLISECONDS } from '/imports/ui/components/user-emotions/emotion-button/component';

const EmotionModal = ({
  userEmotions,
  meetingsCreationTime,
  dismiss,
}) => {
  const withRoundTime = userEmotions.flatMap(({ data }) => data.map(({ timestamp, ...d }) => ({
    timestamp:
        Math.round(timestamp / EMOTION_INTERVALL_MILLISECONDS) * EMOTION_INTERVALL_MILLISECONDS,
    ...d,
  })));
  const grouped = _.groupBy(withRoundTime, 'timestamp');
  const avgGroup = Object.fromEntries(
    Object.entries(grouped).map(([time, data]) => {
      const expressions = {
        angry: _.meanBy(data, ({ exp }) => exp.angry).toFixed(3),
        disgusted: _.meanBy(data, ({ exp }) => exp.disgusted).toFixed(3),
        fearful: _.meanBy(data, ({ exp }) => exp.fearful).toFixed(3),
        neutral: _.meanBy(data, ({ exp }) => exp.neutral).toFixed(3),
        happy: _.meanBy(data, ({ exp }) => exp.happy).toFixed(3),
        sad: _.meanBy(data, ({ exp }) => exp.sad).toFixed(3),
        surprised: _.meanBy(data, ({ exp }) => exp.surprised).toFixed(3),
      };

      return [time, {
        ...expressions,
        time,
      }];
    }),
  );

  const start = Math.round(meetingsCreationTime / EMOTION_INTERVALL_MILLISECONDS)
     * EMOTION_INTERVALL_MILLISECONDS;
  const current = Math.round(Date.now() / EMOTION_INTERVALL_MILLISECONDS)
     * EMOTION_INTERVALL_MILLISECONDS;
  const count = (current - start) / EMOTION_INTERVALL_MILLISECONDS;
  const data = new Array(count).fill(0).map((__, idx) => {
    const nTime = start + idx * EMOTION_INTERVALL_MILLISECONDS;
    const sTime = String(nTime);
    if (avgGroup[sTime]) {
      return {
        ...avgGroup[sTime],
        time: -(current - nTime) / 1000,
      };
    }

    return {
      time: -(current - nTime) / 1000,
      angry: 0,
      disgusted: 0,
      fearful: 0,
      neutral: 0,
      happy: 0,
      sad: 0,
      surprised: 0,
    };
  });

  return (
    <>
      <Modal
        dismiss={dismiss}
        title="Emotion Version Selection"
      >
        <LineChart width={570} height={400} data={_.takeRight(data, 12 * 5)}>
          <Line type="linear" dataKey="happy" stroke="#feca57" isAnimationActive={false} />
          <Line type="linear" dataKey="surprised" stroke="#1dd1a1" isAnimationActive={false} />
          <Line type="linear" dataKey="sad" stroke="#10ac84" isAnimationActive={false} />
          <Line type="linear" dataKey="fearful" stroke="#8884d8" isAnimationActive={false} />
          <Line type="linear" dataKey="disgusted" stroke="#222f3e" isAnimationActive={false} />
          <Line type="linear" dataKey="angry" stroke="#ff6b6b" isAnimationActive={false} />
          <Line type="linear" dataKey="neutral" stroke="#c8d6e5" isAnimationActive={false} />
          <XAxis dataKey="time" />
          <YAxis />
          <Legend verticalAlign="top" height={36} />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
        </LineChart>
      </Modal>
    </>
  );
};

const withData = withTracker(() => ({
  userEmotions: UserEmotions
    .find({ meetingId: Auth.meetingID })
    .fetch(),
  meetingsCreationTime: Meetings
    .find({ meetingId: Auth.meetingID })
    .fetch()[0].durationProps.createdTime,
}));

export default withData(EmotionModal);
