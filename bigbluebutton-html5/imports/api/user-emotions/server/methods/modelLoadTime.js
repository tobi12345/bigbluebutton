import { extractCredentials } from '/imports/api/common/server/helpers';
import * as fs from 'fs/promises';
import dataPath from './DataPath';

export default async function modelLoadTime(timestamp, duration,) {
  const { meetingId, requesterUserId: userId } = extractCredentials(this.userId);

  check(meetingId, String);
  check(userId, String);
  check(timestamp, Number);

  const data = {
    kind: "modelload",
    userId,
    timestamp,
    duration,
  }

  await fs.appendFile(dataPath(meetingId), `${JSON.stringify(data)}\n`);
}
