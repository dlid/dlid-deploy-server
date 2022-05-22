import { executeCommand } from './execute-command';
import { Logger } from './logger';

export class ServerSetup {

  private _log: Logger;

  constructor() {
    this._log = new Logger();
  }

  public async run(): Promise<void> {

    // this._log.debug(`Debug log`);  
    // this._log.info(`Info log`);
    // this._log.warn(`warn log`);
    // this._log.error(`error log`);

    await this.upgradeAndClean();

    await this.installNano();

    await this.installNano();

    await this.installCurl();

    await this.installDotnet();

    await this.installCertbot();

  }

  private async isInstalled(name: string): Promise<boolean> {
    const log = this._log.start(`Checking if ${name} is available`);

    try {
      const result = await executeCommand({
        command: `which`,
        arguments: [name]
      });
      console.log(JSON.stringify(result));
      log.withSuccess(result, result)
      return true;
    } catch (e: any) {
      log.withFailure(`Could not run which command`, e);
      return false;
    }
  }

  private async upgradeAndClean(): Promise<void> {

    const log = this._log.start(`Running apt-get update`);

    try {
      await executeCommand({
        command: `apt-get`,
        arguments: [`update`, `-y`]
      });
      log.withSuccess()
    } catch (e: any) {
      log.withFailure(`Could not run apt-get update`, e);
    }

  }

  private async installNano(): Promise<void> {

    const log = this._log.start(`Installing nano`);

    try {

      const isInstalled = this.isInstalled(`nano`);

      // await executeCommand({
      //   command: `apt-get`,
      //   arguments: [`update`, `-y`]
      // });
      log.withSuccess()
    } catch (e: any) {
      log.withFailure(e);
    }

    return Promise.reject(`not implemented`)
  }

  private async installCurl(): Promise<void> {
    return Promise.reject(`not implemented`)
  }

  private async installDotnet(): Promise<void> {
    return Promise.reject(`not implemented`)
  }

  private async installCertbot(): Promise<void> {
    return Promise.reject(`not implemented`)
  }

  // firewall?


}

/*


server name: deploytest
user: david
pwd: snorkel

when testing - we need npm and nodejs to build
git clone https://github.com/dlid/dlid-deploy-server
apt install -y npm
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt-get install -y nodejs

node --version
npm --version

# upgrade and clean
sudo apt-get update
sudo apt-get -y upgrade
apt-get autoremove
apt-get autoclean


apt-get install nano

echo "[START] APT UPDATE"
apt-get install -y curl

echo "[START] INSTALL NODE V14"
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt-get install -y nodejs

echo "[START] INSTALL NPM"
apt install -y npm

npm install
npm build

echo "[START] INSTALL APACHE"
apt install -y apache2
a2enmod ssl	
a2enmod rewrite
a2enmod proxy
a2enmod proxy_http
a2enmod request
a2enmod headers
service apache2 restart

sudo add-apt-repository ppa:certbot/certbot
sudo apt install python-certbot-apache

wget https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

sudo apt-get update
sudo apt-get install -y apt-transport-https
sudo apt-get update
sudo apt-get install -y dotnet-sdk-6.0




firewall?

Enabling firewall rules
With everything installed we need to make sure these connections are allowed through the firewall. The best I found for that was to use ufw (Uncomplicated Firewall). This is installed by default, but if it is not sudo apt install ufw. Lets enable ufw.

sudo ufw enable
Now we can see what we are able to allow.

sudo ufw app list
Of those, we will enable a couple of them. To be honest, I can't remember if you need both Apache and Apache Full but I have them both allowed.

sudo ufw allow Apache
sudo ufw allow 'Apache Full'
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
Port 22 is for secure ssh and secure ftp (21 is just ftp) while port 80 and 443 are for http and https respectively. If you are using ipv6 instead of ipv4, then you might want to also run the ones below.

sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
You can run the following command to see the status of the firewall and everything that is allowed.

sudo ufw status



*/
