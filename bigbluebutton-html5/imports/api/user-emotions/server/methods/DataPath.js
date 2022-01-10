import * as os from 'os'

export default (id) => `${os.homedir()}/emotion-data/${id}.txt`;
