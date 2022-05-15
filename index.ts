import { Command } from 'commander'

const program = new Command();

program
  .name(`dlid-deploy-server`)
  .description(`Server for deploying webapplications`)
  .version(`0.0.1`);

program.command(`setup`)
  .option(`-d, --domain <domain>`, `Setup server with domain and ssl - use for public servers`)
  .option(`-p, --port <port>`, `The local port to host the server on`, `1980`)
  .action(options => {
    console.warn(`setup`, options);

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
