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

* [ ] Change Language in `All Settings -> Language Support` to English.

* [ ] Disable Laptop `Touchpad` pressing `Fn -> F3`.

* [ ] Install [Git](https://help.ubuntu.com/lts/serverguide/git.html) and reconfigure.
```shell
$ sudo apt-get install git
$ git config --global user.email "enogrob@gmail.com"
$ git config --global user.name "Roberto Nogueira"
```

* [ ] Install [Golang](https://github.com/golang/go/wiki/Ubuntu).
```shell
$ snap install --classic go
$ snap list
```

* [ ] Install [RVM](https://rvm.io/rvm/install).
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

Check  `Terminal -> Profile Preferences -> Tab Command` to Run command as a login shell.


* [ ] Install [Hub](https://github.com/github/hub) and reconfigure.
```shell
$ git clone https://github.com/github/hub.git
$ cd hub
$ make install prefix=/usr/local
```

* [ ] Install [Caffeine](http://www.edivaldobrito.com.br/impedir-o-bloqueio-da-tela/) and its indicator.
```shell
$ sudo add-apt-repository ppa:caffeine-developers/ppa
$ sudo apt-get update
$ sudo apt-get install caffeine
```

* [ ] Recover [dot](https://github.com/enogrob/enogrob-unix-dotfiles) files configure Terminal.
```shell
$ git clone $ git@github.com:enogrob/enogrob-unix-dotfiles.git
$ cd enogrob-unix-dotfiles
$ cp * ~/enogrob
$ cd ..
$ \rm -rf enogrob-unix-dotfiles
```


* [ ] Install [tree](https://askubuntu.com/questions/572093/how-to-install-tree-with-command-line).
```shell
$ sudo apt-get install tree
$ tree --version
```

* [ ] Install [speedtest-cli](https://github.com/sivel/speedtest-cli).
```shell
$ sudo apt-get install python-pip
$ pip -V
$ pip install git+https://github.com/sivel/speedtest-cli.git
$ speedtest-cli --version
```

* [ ] Install [sdkman](http://sdkman.io/install.html).
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

* [ ] Install [Google Chrome](http://askubuntu.com/questions/760085/how-do-you-install-google-chrome-on-ubuntu-16-04).
```shel
$ sudo apt-get update
$ sudo apt-get install -y unzip openjdk-8-jre-headless xvfb libxi6 libgconf-2-4
$ wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | $ sudo tee /etc/apt/sources.list.d/google-chrome.list
$ sudo apt-get update
$ sudo apt-get install google-chrome-stable
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

* [ ] Install [Dropbox](https://www.dropbox.com/install-linux).
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

* [ ] Install [RVM](https://rvm.io/rvm/install).
```shell
$ gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
$ \curl -sSL https://get.rvm.io | bash
```

* [ ] Install Nodejs(https://stackoverflow.com/questions/40490614/installing-nodejs-on-linux-ubuntu-16-04/40490843).
```shell
$ sudo apt-get install nodejs
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

* [ ] Install Vim and reconfigure
* [ ] Install NVim and reconfigure

* [ ] Install [todotxt-cli](https://github.com/todotxt/todo.txt-cli) and reconfigure.
```shell
$ git clone https://github.com/todotxt/todo.txt-cli.git
$ cd todo.txt-cli
$ make
$ make install
$ make test
```

* [ ] Install [Things Today](https://github.com/enogrob/project-things-today) and reconfigure.
```shell
$ git clone git@github.com:enogrob/project-things-today.git
$ cd project-things-today
$ sudo bash ./.todayrc_install.sh
```

* [ ] Install Calibre and reconfigure
* [ ] Install Double Commander and reconfigure
* [ ] Install Atom and reconfigure
* [ ] Install Rubymine and reconfigure
* [ ] Install Postman
* [ ] Install Compiz and reconfigure
* [ ] Install Skype
* [ ] Install Slack
* [ ] Install Autokey
* [ ] Install Shutter
* [ ] Install Pinta
* [ ] Install Dash compatible for Linux
* [ ] Install and run Parallels Transport Agent
* [ ] Establish Docker Workflow for development
```
