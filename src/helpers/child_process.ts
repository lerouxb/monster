import util from 'util';
import { exec as _exec } from 'child_process';
export const exec = util.promisify(_exec);