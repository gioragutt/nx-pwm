import rimraf from 'rimraf';
import { promisify } from 'util';

export const rimrafAsync = promisify(rimraf);
