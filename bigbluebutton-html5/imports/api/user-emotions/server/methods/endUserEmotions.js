import { extractCredentials } from '/imports/api/common/server/helpers';
import * as fs from 'fs/promises';
import dataPath from './DataPath';

export default async function endUserEmotions(timestamp) {
  const { meetingId, requesterUserId: userId } = extractCredentials(this.userId);

  check(meetingId, String);
  check(userId, String);
  check(timestamp, Number);

  await fs.appendFile(dataPath(meetingId), `${['end', userId, timestamp].join(';')}\n`);
}
