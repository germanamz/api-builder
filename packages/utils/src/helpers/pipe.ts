import { pipeline } from 'stream';
import { promisify } from 'util';

const pipe = promisify(pipeline);

export default pipe;
