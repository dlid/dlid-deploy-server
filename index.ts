import { ServerSetup } from './lib/server-setup';
import { Command } from 'commander'
import { executeCommand } from './lib/execute-command';
import RuntimeContext from './lib/runtime-context';
import { LogSetting } from './lib/logger';

RuntimeContext.reset();

const program = new Command();

program
  .name(`dlid-deploy-server`)
  .description(`Server for deploying webapplications`)
  .version(`0.0.1`);


program.command(`setup`)
  .option(`-d, --domain <domain>`, `Setup server with domain and ssl - use for public servers`)
  .option(`-p, --port <port>`, `The local port to host the server on`, `1980`)
  .option(`--verbose`, `Enable verbose logging (Will override --quiet option)`)
  .option(`-q, --quiet`, `Disable all output other than errors`)
  .action(async options => {
    console.warn(`setup`, options);

    if (options.verbose === true) {
      RuntimeContext.current.logSetting = LogSetting.Verbose;
    } else if (options.quiet === true) {
      RuntimeContext.current.logSetting = LogSetting.Quiet;
    }

    try {
      const serverSetup = new ServerSetup();
      await serverSetup.run()
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));
      program.error(`An error occured`);
    }

    // Make sure apache is installed
    // Make sure dotnet is installed
    // Make sure git is installed
    // if domain is used - make sure certbot + apache is setup
    // create service to run webserver


  });

program.command(`start`)
  .option(`-p, --port <port>`, `The port to run the server on`)
  .action(options => {
    console.log(`start`, options);
  });


program.parse(process.argv);
