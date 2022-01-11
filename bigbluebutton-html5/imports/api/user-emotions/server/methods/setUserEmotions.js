import { extractCredentials } from '/imports/api/common/server/helpers';
import * as fs from 'fs/promises';
import dataPath from './DataPath';

export default async function setUserEmotions(detections, timestamp, duration, type) {
  const { meetingId, requesterUserId: userId } = extractCredentials(this.userId);

  check(meetingId, String);
  check(userId, String);
  check(timestamp, Number);


  const data = {
    kind: "result",
    userId,
    detections,
    timestamp,
    duration,
    type
  }

  await fs.appendFile(dataPath(meetingId), `${JSON.stringify(data)}\n`);

  // const selector = {
  //   userId,
  //   meetingId,
  // };

  // const currentUserEmotions = UserEmotions.findOne(selector);
  // if (currentUserEmotions) {
  //   const modifier = {
  //     $push: {
  //       data: { timestamp, expressions },
  //     },
  //   };
  //   UserEmotions.update(selector, modifier);
  // } else {
  //   UserEmotions.insert({
  //     ...selector,
  //     data: [{ timestamp, expressions }],
  //   });
  // }
}
