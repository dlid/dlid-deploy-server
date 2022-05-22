import RuntimeContext from './runtime-context';
export enum LogSetting {
  Information,
  Quiet,
  Verbose
}

export class Logger {

  private _logSetting: LogSetting = LogSetting.Information;

  constructor() {
    this._logSetting = RuntimeContext.current.logSetting;
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

  public setLogLevel(setting: LogSetting): void {
    this._logSetting = setting;
  }

  public info(...args: (object | string)[]): void {
    if (this._logSetting !== LogSetting.Quiet) {
      console.log(this.bepaint(`{color:cyan}INFO`), args);
    }
  }

  public debug(...args: (object | string)[]): void {
    if (this._logSetting == LogSetting.Verbose) {
      console.log(`DEBUG`, args);
    }
  }

  public warn(...args: (object | string)[]): void {
    if (this._logSetting !== LogSetting.Quiet) {
      console.log(this.bepaint(`{color:yellow}WARN`), args);
    }
  }

  public error(...args: (object | string)[]): void {
    console.log(this.bepaint(`{color:red}ERROR`), args);
  }



}
