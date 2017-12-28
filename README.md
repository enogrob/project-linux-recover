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


* [x] Install [Hub](https://github.com/github/hub) and reconfigure.
Download attempt(it successful):
```shell
$ gunzip hub-linux-amd64-2.3.0-pre10.targz
$ tar-xvf hub-linux-amd64-2.3.0-pre10
$ cd hub-linux-amd64-2.3.0-pre10
$ sudo ./install
```

Native compiling:
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

Run `Caffeine` and `Caffeine Indicator` from launcher. Include them in `Start Applications` initiated in `Dash`.

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

* [x] Install [Postgres](https://help.ubuntu.com/lts/serverguide/postgresql.html) with enogrob user.
```shell
$ sudo apt install postgresql postgresql-contrib libpq-dev
$ sudo su - postgres
$ createuser enogrob
$ psql
~ \du;
~ ALTER USER "enogrob" WITH SUPERUSER;
~ ALTER USER "enogrob" WITH CREATEDB;
~ ALTER USER "enogrob" WITH CREATEROLE;
~ ALTER USER "enogrob" WITH REPLICATION;
~ ALTER USER "enogrob" WITH BYPASSRLS;
~\du;
~\q;
$ service --status-all | grep postgresql
```

* [x] Install [Docker](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/).
```shell
$ sudo apt-get update
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo apt-key fingerprint 0EBFCD88
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce
$ sudo groupadd docker
$ sudo usermod -aG docker $USER
$ sudo chmod 666 /var/run/docker.sock
$ docker info
```

To install [Docker Machine](https://docs.docker.com/machine/install-machine/#install-machine-directly) run the following commands:
```shell
$ curl -L https://github.com/docker/machine/releases/download/v0.13.0/docker-machine-`uname -s`-`uname -m` >/tmp/docker-machine &&
chmod +x /tmp/docker-machine &&
sudo cp /tmp/docker-machine /usr/local/bin/docker-machine
$ docker-machine version
```

To install [Docker Compose](https://docs.docker.com/compose/install/#install-compose), run the following commands:
```shell
$ sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
$ docker-compose version
```

To install [Kitematic](https://github.com/docker/kitematic/releases/).
```shell
$ cd ~/Downloads
$ unzip Kitematic-0.17.3-Ubuntu.zip
$ sudo dpkg -i ./dist/Kitematic_0.17.3_amd64.deb
$ sudo apt-get install -f
```

* [x] Install [Vim](https://docs.oseems.com/general/operatingsystem/ubuntu/install-vim) and reconfigure.
```shell
sudo apt remove vim-tiny
sudo apt update
sudo apt install vim
```

Install [powerline fonts](https://github.com/powerline/fonts).
In some distributions, Terminess `Powerline` is ignored by default and must be explicitly allowed. A fontconfig file is provided which enables it. Copy this file from the fontconfig directory to your home folder under `~/.config/fontconfig/conf.d` (create it if it doesn't exist) and re-run `fc-cache -vf`.
```shell
sudo apt-get install fonts-powerline
```

* [x] Install [NVim](https://github.com/neovim/neovim/wiki/Installing-Neovim) and reconfigure.
```shell
sudo apt-get install python-dev python-pip python3-dev python3-pip
sudo add-apt-repository ppa:neovim-ppa/stable
sudo apt-get update
sudo apt-get install neovim
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

* [x] Install [Skype](https://www.skype.com/en/get-skype/) and reconfigure.
Download it and install it accordingly:
```shell
$ sudo dpkg -i ./skypeforlinux-64.deb
$ sudo apt-get install -f
```

* [x] Install [Slack](https://slack.com/downloads/linux) and reconfigure.
Download it and install it accordingly:
```shell
$ sudo dpkg -i ./slack-desktop-3.0.2-amd64.deb
$ sudo apt-get install -f
```

* [x] Install [Parcellite](http://parcellite.sourceforge.net/) and reconfigure.
Download and install from the `Ubuntu Software`.

* [x] Install [Shutter](http://shutter-project.org) and reconfigure.
Download and install from the `Ubuntu Software`.

* [x] Install [Pinta](https://pinta-project.com/pintaproject/pinta/howto/installing-pinta) and reconfigure.
```shell
$ sudo add-apt-repository ppa:pinta-maintainers/pinta-stable
$ sudo apt-get update
$ sudo apt-get install pinta
```

* [x] Install [Zeal](https://uappexplorer.com) compatible and reconfigure.
```shell
$ sudo snap install zeal-casept --classic
```

* [x] Install [Spotify](https://uappexplorer.com) compatible and reconfigure.
```shell
$ sudo snap install spotify --classic
```

* [x] Install [neofetch](https://github.com/dylanaraps/neofetch/wiki/Installation) compatible and reconfigure.
```shell
$ echo "deb http://dl.bintray.com/dawidd6/neofetch jessie main" | sudo tee -a /etc/apt/sources.list
$ sudo snap install spotify --classic
$ curl "https://bintray.com/user/downloadSubjectPublicKey?username=bintray"| sudo apt-key add -
$ sudo apt-get update
$ sudo apt-get install neofetch
```

* [ ] Install and run [Parallels Transport Agent](https://www.parallels.com/pc/#lin) and reconfigure.
```shell
$ chmod +x ParallelsTransporterAgent-13.2.0-43213-amd64-lin.run
$ sudo ./ParallelsTransporterAgent-13.2.0-43213-amd64-lin.run
```

* [x] Establish [Docker Workflow](https://rubythursday.com) for development.
See `project-ruby-thursday`.

* [x] [Ruby Snack #59: Intro to Docker](https://rubythursday.com/episodes/ruby-snack-59-intro-to-docker).
* [x] [Ruby Snack #60: Create New Rails App With Docker](https://rubythursday.com/episodes/create_new_rails_app_with_docker).
* [ ] [Ruby Snack #61: Rails Development Flow With Docker](https://rubythursday.com/episodes/ruby_snack_61_rails_development_flow_with_docker).
* [ ] [Ruby Snack # 62: Add Additional Dependencies to Docker](https://rubythursday.com/episodes/ruby-snack-62-add-additional-dependencies-to-docker).
