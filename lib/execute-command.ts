
/***
 * 
 */

import { spawn } from 'child_process';
import { Logger } from './logger';


export interface ExecuteCommandArg {
  command: string;
  arguments?: string[];
  workingDirectory?: string;
}

export interface ExecuteCommandResult {
  success: boolean;
  code: number;
  data: string;
  error?: string;
  command: string;
}

export async function executeCommand(args: ExecuteCommandArg): Promise<ExecuteCommandResult> {

  const log = new Logger();

  return new Promise((resolve, reject) => {

    const readableCommand = [args.command, ...args.arguments || []].join(` `);

    log.debug(`exec ${readableCommand}`);

    const child = spawn(args.command, args.arguments, {
      shell: true, cwd: args.workingDirectory
    });




    let content = ``;
    let processError = ``;


    log.debug(`Process ${child.pid} Started`);

    child.stdout.on(`data`, function (data) {
      content += data.toString();
    });
    child.stderr.on(`data`, function (data) {
      content += data.toString();
    });
    child.on(`error`, function (d) {
      processError = d.toString();
    })

    child.on(`close`, function (code) {
      if (code !== 0) {

        log.warn(`Process ${child.pid} Exited with code ${code}`);

        // console.log(`\x1b[31m===============================`);
        // console.log(`[Process ${child.pid}] ERROR`);
        // console.log(`[Process ${child.pid}] ` + readableCommand);
        // console.log(content || processError);
        // console.log(`\x1b[0m`);
        reject({
          message: `Process exited with code ` + code,
          code: code,
          command: readableCommand,
          result: content || processError
        });
        return;
      }

      log.debug(`Process ${child.pid} Exited with code ${code}`);

      resolve({
        success: code === 0,
        data: content,
        code: code,
        error: processError,
        command: readableCommand
      });
    });
  });

}
