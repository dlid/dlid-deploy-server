import { LogSetting } from './logger';

class RuntimeContext {

  private static _instance?: RuntimeContext;

  public logSetting: LogSetting = LogSetting.Information;

  /**
   * Delete the current instance to make sure we get a new one
   */
  public static reset(): void {
    this._instance = undefined;
  }

  static get current(): RuntimeContext {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new RuntimeContext();
    return this._instance;
  }


}

export default RuntimeContext;
