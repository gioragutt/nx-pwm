import { exec } from 'child_process';
import { promisify } from 'util';

export const execAsync = promisify(exec);

export const getOutputAsync = async (command: string) => {
  const { stdout } = await execAsync(command);
  return stdout;
};
