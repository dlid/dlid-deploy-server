import { basename } from 'path';
import RuntimeContext from './runtime-context';
export enum LogSetting {
  Information,
  Quiet,
  Verbose
}

export class Logger {

  protected _logSetting: LogSetting = LogSetting.Information;
  protected _indent = 0;
  protected _name?: string;

  constructor(options?: { indent?: number; name?: string; }) {
    this._logSetting = RuntimeContext.current.logSetting;
    this._indent = options?.indent || RuntimeContext.current.logIndent;
    this._name = options?.name;
  }

  private colors: { [key: string]: string } = {
    'reset': `\x1b[0m`,
    'black': `\x1b[30m`,
    'red': `\x1b[31m`,
    'green': `\x1b[32m`,
    'yellow': `\x1b[33m`,
    'blue': `\x1b[34m`,
    'magenta': `\x1b[35m`,
    'cyan': `\x1b[36m`,
    'white': `\x1b[37m`
  }

  private _logLevelColors: { [key: string]: string } = {
    'info': `cyan`,
    'debug': `white`,
    'warn': `yellow`,
    'error': `red`
  };

  public start(name: string): ChildLogger {
    this.info(`{color:cyan}${name}`);
    RuntimeContext.current.logIndent++;
    return new ChildLogger({
      indent: this._indent + 1,
      name
    });
  }

  protected writeLog(options: { args: (object | string)[], level: `info` | `error` | `debug` | `warn` }) {
    const when = new Date();

    const paddedLevel = options.level.padEnd(5, ` `).toUpperCase();
    const level = this.bepaint(`{color:${this._logLevelColors[options.level]}}${paddedLevel}{color}`);

    const message = ` `.repeat(this._indent) +
      options.args?.map(arg => {

        if (typeof arg === `string`) {
          return this.bepaint(arg);
        } else if (typeof arg === `object`) {
          return this.bepaint(`{color:magenta}` + JSON.stringify(arg, null, 0) + `{color}`);
        }

      }).join(` `);


    console.log(`${when.toISOString()} | ${level} | ${message}`);

  }

  public setLogLevel(setting: LogSetting): void {
    this._logSetting = setting;
  }

  public info(...args: (object | string)[]): void {
    if (this._logSetting !== LogSetting.Quiet) {
      this.writeLog({
        args,
        level: `info`
      });
    }
  }

  public debug(...args: (object | string)[]): void {
    if (this._logSetting == LogSetting.Verbose) {
      this.writeLog({
        args,
        level: `debug`
      });
    }
  }

  public warn(...args: (object | string)[]): void {
    if (this._logSetting !== LogSetting.Quiet) {
      this.writeLog({
        args,
        level: `warn`
      });
    }
  }

  public error(...args: (object | string)[]): void {
    this.writeLog({
      args,
      level: `error`
    });
  }


  /***
   * Simple color coding of a string using syntax {color:red}text{color}
   */
  private bepaint(value: string, stripAnsi = false): string {
    let match;
    let newValue = value;
    const coloredTexts = [];

    do {
      match = newValue.match(/\{color:([a-zA-Z\-]+)\}(.*?)(\{color\}|$)/);
      if (match) {
        newValue = newValue.replace(match[0], `_%C${coloredTexts.length}%_`);

        if (this.colors[match[1]]) {
          coloredTexts.push((stripAnsi ? `` : this.colors[match[1]]) + match[2] + (stripAnsi ? `` : this.colors[`reset`]));
        } else {
          coloredTexts.push(match[2]);
        }
      }
    } while (match);

    coloredTexts.forEach((text: string, i: number) => {
      newValue = newValue.replace(`_%C${i}%_`, text);
    })

    return newValue;
  }


}


export class ChildLogger extends Logger {


  public withSuccess(...args: (object | string)[]): void {
    this.writeLog({
      args: [`{color:green}OK`, `({color:cyan}${this._name})`, ...args],
      level: `info`
    });
    RuntimeContext.current.logIndent--;
  }

  public withFailure(...args: (object | string)[]): void {
    this.writeLog({
      args: [`{color:red}## FAILED`, `({color:cyan}${this._name})`, ...args],
      level: `error`
    });
    RuntimeContext.current.logIndent--;
  }

  public close(...args: (object | string)[]): void {
    if (args?.length > 0) {
      this.writeLog({
        args: [`{color:cyan}${this._name}`, `COMPLETED`, ...args],
        level: `error`
      });
    }
    RuntimeContext.current.logIndent--;
  }

}
