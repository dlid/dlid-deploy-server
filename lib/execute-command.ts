
/***
 * 
 */

import { spawn } from 'child_process';
import { Logger } from './logger';


export interface ExecuteCommandArg {
  command: string;
  arguments?: string[];
  workingDirectory?: string;
  continueOnError?: boolean;
}

export interface ExecuteCommandResult {
  success: boolean;
  code: number;
  data: string;
  error?: string;
  command: string;
}

export async function executeCommand(args: ExecuteCommandArg | string[]): Promise<ExecuteCommandResult> {

  let options: ExecuteCommandArg;

  if (Array.isArray(args)) {
    options = {
      command: args[0],
      arguments: args.slice(1)
    }
  } else {
    options = args;
  }

  const log = new Logger();

  return new Promise((resolve, reject) => {

    const readableCommand = [options.command, ...options.arguments || []].join(` `);

    log.debug(`exec ${readableCommand}`);

    const child = spawn(options.command, options.arguments, {
      shell: true, cwd: options.workingDirectory
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

    child.on(`close`, function (code: number) {

      if (options.continueOnError !== true && code !== 0) {

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
