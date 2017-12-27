```
Roberto Nogueira  
BSd EE, MSd CE
Solution Integrator Experienced - Certified by Ericsson
```
# Project Linux Recover

![project image](images/project.png)

**About**

The idea about this project is to create a practical way to reinstall the essential applications in the `Linux` in order to restore a real productive `Development` environment, targeting the main applications and introducing the `Docker Workflow`.

[Homepage](https://project.com)

## Topics

* [x] Change Language in `All Settings -> Language Support` to English.
Set to 22 in `System Settings -> Appearance -> look -> Launch icon size`.
Check Enable Workplaces and Add show desktop icon to the launcher in  `System Settings -> Appearance -> Behaviour`.
In `All Settings -> Display` select `Build-in-Display` in `Launcher placement`.

* [x] Disable Laptop `Touchpad` pressing `Fn -> F3`.

* [x] Install [Git](https://help.ubuntu.com/lts/serverguide/git.html) and reconfigure.
```shell
$ sudo apt-get install git
$ git config --global user.email "enogrob@gmail.com"
$ git config --global user.name "Roberto Nogueira"
$ cd ~/.ssh && ssh-keygen
$ sudo apt-get install xclip
$ cat id_rsa.pub | xclip -sel clip
```

* [x] Install [Golang](https://github.com/golang/go/wiki/Ubuntu).
```shell
$ snap install --classic go
$ snap list
```

* [x] Install [RVM](https://rvm.io/rvm/install).
```shell
$ gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
$ sudo apt-get install curl
$ \curl -sSL https://get.rvm.io | bash
$ source ~/.rvm/scripts/rvm
$ rvm install ruby-2.3.1
$ rvm use ruby-2.3.1 --default
$ rvm list
$ gem install bundler
```

Check `Run command as a login shell` from `Terminal -> Profile Preferences -> Command`.
Select `Tab` in `Open new terminals` from `Terminal -> Preferences`.


* [ ] Install [Hub](https://github.com/github/hub) and reconfigure.
```shell
$ git clone https://github.com/github/hub.git
$ cd hub
$ make install prefix=/usr/local
$ echo alias git='hub' >> .bashrc
```

* [x] Install [Caffeine](http://www.edivaldobrito.com.br/impedir-o-bloqueio-da-tela/) and its indicator.
```shell
$ sudo add-apt-repository ppa:caffeine-developers/ppa
$ sudo apt-get update
$ sudo apt-get install caffeine
```

Run `Caffeine` and `Caffeine Indicator` from launcher.

* [x] Recover [dotfiles](https://github.com/enogrob/enogrob-unix-dotfiles) files configure Terminal.
```shell
$ git clone $ git@github.com:enogrob/enogrob-unix-dotfiles.git
$ cd enogrob-unix-dotfiles
$ cp * ~/enogrob
$ cd ..
$ \rm -rf enogrob-unix-dotfiles
```

* [x] Install [tree](https://askubuntu.com/questions/572093/how-to-install-tree-with-command-line).
```shell
$ sudo apt-get install tree
$ tree --version
```

* [x] Install [speedtest-cli](https://github.com/sivel/speedtest-cli).
```shell
$ sudo apt-get install python-pip
$ pip -V
$ pip install git+https://github.com/sivel/speedtest-cli.git
$ speedtest-cli --version
```

* [x] Install [sdkman](http://sdkman.io/install.html).
```shell
$ curl -s "https://get.sdkman.io" | bash
$ source "$HOME/.sdkman/bin/sdkman-init.sh"
$ sdk version
```
Install [java](http://sdkman.io/usage.html) with `sdkman`.
```shell
$ sdk install java
java -version
```

* [x] Install [Google Chrome](http://askubuntu.com/questions/760085/how-do-you-install-google-chrome-on-ubuntu-16-04).
```shel
$ wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
$ sudo dpkg -i --force-depends google-chrome-stable_current_amd64.deb
$ sudo apt-get install -f
```

* [ ] Install [Google Driver](http://askubuntu.com/questions/760085/how-do-you-install-google-chrome-on-ubuntu-16-04).
```shell
CHROME_DRIVER_VERSION=`curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`
wget -N http://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip -P ~/
unzip ~/chromedriver_linux64.zip -d ~/
rm ~/chromedriver_linux64.zip
sudo mv -f ~/chromedriver /usr/local/bin/chromedriver
sudo chown root:root /usr/local/bin/chromedriver
sudo chmod 0755 /usr/local/bin/chromedriver
```

* [ ] Install [Selenium](https://gist.github.com/ziadoz/3e8ab7e944d02fe872c3454d17af31a5).
```shell
$ SELENIUM_STANDALONE_VERSION=3.4.0
$ SELENIUM_SUBDIR=$(echo "$SELENIUM_STANDALONE_VERSION" | cut -d"." -f-2)
$ wget -N http://selenium-release.storage.googleapis.com/$SELENIUM_SUBDIR/selenium-server-standalone-$SELENIUM_STANDALONE_VERSION.jar -P ~/
$ sudo mv -f ~/selenium-server-standalone-$SELENIUM_STANDALONE_VERSION.jar /usr/local/bin/selenium-server-standalone.jar
$ sudo chown root:root /usr/local/bin/selenium-server-standalone.jar
$ sudo chmod 0755 /usr/local/bin/selenium-server-standalone.jar
```

* [x] Install [Dropbox](https://www.dropbox.com/install-linux).
```shell
$ cd ~ && wget -O - "https://www.dropbox.com/download?plat=lnx.x86_64" | tar xzf -
```

Next, run the Dropbox daemon from the newly created `.dropbox-dist` folder.
```shell
$ ~/.dropbox-dist/dropboxd
```

* [ ] Install [Google Chrome extensions](https://stackoverflow.com/questions/20782557/load-unpacked-chrome-extension-programatically) and reconfigure.
```shell
chrome --load-and-launch-app=~/Dropbox/Projects_CHROME
```

You should place this command in your `.bash_profile` or other startup script.
```shell
eval "$(hub alias -s)"
```

* [x] Install [Desktop Wallpaper](git@github.com:enogrob/project-linux-recover.git).
```shell
$ git clone git@github.com:enogrob/project-linux-recover.git
$ cd project-linux-recover
$ cd pictures
$ cp * ~/Pictures
```

Rught click `Change Desktop Background` and then select the `Wallpaper` in the `Picture Folder`.

* [ ] Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
```shell
# replace REPLACE_ME_OS/REPLACE_ME_ARCH with values as noted below
$ wget https://cli-assets.heroku.com/heroku-cli/channels/stable/heroku-cli-linux-x64.tar.gz -O heroku.tar.gz
$ tar -xvzf heroku.tar.gz
$ mkdir -p /usr/local/lib /usr/local/bin
$ mv heroku-cli* /usr/local/lib/heroku
$ ln -s /usr/local/lib/heroku/bin/heroku /usr/local/bin/heroku
$ heroku --version
```

* [x] Install Nodejs(https://stackoverflow.com/questions/40490614/installing-nodejs-on-linux-ubuntu-16-04/40490843).
```shell
$ sudo apt-get install nodejs nodejs-legacy npm
$ node --version
$ npm --version
```

* [ ] Install [Postgres](https://help.ubuntu.com/lts/serverguide/postgresql.html) with enogrob user.
```shell
$ sudo apt install postgresql
$ sudo -u postgres psql
$ sudo -u postgres createuser enogrob
$ psql
$ \du;
$ ALTER USER "enogrob" WITH SUPERUSER;
```

* [ ] Install `Docker`.
```shell
$ curl -sSL https://get.docker.com/ | sh
$ docker version
```

To install `Docker Machine` run the following commands:
```shell
$ curl -L "https://github.com/docker/machine/releases/download/v0.9.0/
$ docker-machine-$(uname -s)-$(uname -m)" -o /tmp/docker-machine
$ chmod +x /tmp/docker-machine
$ sudo cp /tmp/docker-machine /usr/local/bin/docker-machine
$ docker-machine version
```

To install `Docker Compose`, run the following commands:
```shell
$ curl -L "https://github.com/docker/compose/releases/download/1.10.0/
$ docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ chmod +x /tmp/docker-compose
$ sudo cp /tmp/docker-compose /usr/local/bin/docker-compose
$ docker-compose version
```

* [ ] Install [Vim]() and reconfigure.
```shell
```

* [ ] Install [NVim]() and reconfigure.
```shell
```

* [x] Install [todotxt-cli](https://github.com/todotxt/todo.txt-cli) and reconfigure.
```shell
$ git clone https://github.com/todotxt/todo.txt-cli.git
$ cd todo.txt-cli
$ make
$ sudo make install
$ make test
$ cp -rf  /usr/local/etc/todo ~/.todo
```

* [x] Install [Things Today](https://github.com/enogrob/project-things-today) and reconfigure.
```shell
$ git clone git@github.com:enogrob/project-things-today.git
$ cd project-things-today
$ sudo bash ./.todayrc_install.sh
$ tag -l $PROJECTS/* > .tags
$ cp .tags ~/Projects
```

* [x] Install [Calibre](https://calibre-ebook.com/download_linux) and reconfigure.
```shell
$ sudo -v && wget -nv -O- https://download.calibre-ebook.com/linux-installer.py | sudo python -c "import sys; main=lambda:sys.stderr.write('Download failed\n'); exec(sys.stdin.read()); main()"
```

From the main menu  `Calibre Library -> Import all calibre data` import to `~/Calibre Library`.

* [x] Install [Double Commander](http://www.ubuntugeek.com/install-double-commander-on-ubuntu-16-04.html) and reconfigure.
```shell
$ sudo add-apt-repository ppa:alexx2000/doublecmd
$ sudo apt-get update
$ sudo apt-get install doublecmd-gtk
```

In order to recover the configuration do  a backup copy of the `~/.config/doublecmd`
then delete this folder, start the `new doublecmd` for the first time , then go to, `options->settings`
and check `User home directory` and "on close" , save the configuration. hit `ok` and close `Doublecmd`.
then  copy the files from the backup directory to the newly created `~/.config/doublecmd` and overwrite.
start `Doublecmd` and all is fine.

* [x] Install [Atom](https://discuss.atom.io/t/how-to-backup-all-your-settings/15674/2) and reconfigure.
```shell
$ sudo snap install atom --classic
```

Once a new release is out, install updates via command:
```shell
$ sudo snap refresh atom
```

Take Backup:
```shell
$ cd ~/.atom
$ zip atom.zip ~/.atom/*.cson ~/.atom/*.coffee ~/.atom/*.less ~/.atom/*.json
$ apm list --installed --bare > atom-bare-packages.txt
$ mv ~/atom-* ~/Projects/project-linux-recover/backups
```

Recover Backup:
```shell
$ apm install `cat atom-bare-packages.txt`
$ unzip -d ~/.atom atom.zip
```

* [x] Install [Rubymine](https://uappexplorer.com) and reconfigure.
```shell
$ sudo snap install rubymine --classic
```

* [x] Install [Postman](https://www.getpostman.com) and reconfigure.
Download it and install it accordingly:
```shell
$ gunzip Postman-linux-x64-5.5.0.tar.gz
$ tar -xvf Postman-linux-x64-5.5.0.tar
$ sudo mv Postman /opt
$ ./opt/Postman/Postman&
```

* [x] Install [Compiz](https://apps.ubuntu.com/cat/applications/compizconfig-settings-manager) and reconfigure.
`Compiz` comes already with Ubuntu.
Install from Ubuntu Software `CompizConfig Settings Manager`.
Set keymaps for <ctrl>-<shift> in `Windows Manager -> Grid -> Bindings`.
Check `Cycle Through Multiple Sizes` in `Resize Actions` tab.

* [ ] Install [Skype]() and reconfigure.
```shell
```

* [ ] Install [Slack](https://uappexplorer.com) and reconfigure.
```shell
$ sudo snap install slackapp --classic
```

* [ ] Install [Parcellite]() and reconfigure.
```shell
```

* [ ] Install [Shutter]() and reconfigure.
```shell
```

* [ ] Install [Pinta]() and reconfigure.
```shell
```

* [ ] Install [Zeal](https://uappexplorer.com) compatible and reconfigure.
```shell
$ sudo snap install zeal-casept --classic
```

* [ ] Install and run [Parallels Transport Agent]() and reconfigure.
```shell
```

* [ ] Establish [Docker Workflow]() for development.
```shell
```

```
