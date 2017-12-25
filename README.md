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

* [ ] Install [Caffeine](http://www.edivaldobrito.com.br/impedir-o-bloqueio-da-tela/) and its indicator.
```
sudo add-apt-repository ppa:caffeine-developers/ppa
sudo apt-get update
sudo apt-get install caffeine
```

* [ ] Recover [dot](https://github.com/enogrob/enogrob-unix-dotfiles) files configure Terminal.
```
git clone git@github.com:enogrob/enogrob-unix-dotfiles.git
cd enogrob-unix-dotfiles
cp * ~/enogrob
cd ..
\rm -rf enogrob-unix-dotfiles
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

[ ] Install Dropbox
[ ] Install Google Chrome extensions and reconfigure
[ ] Install Git and reconfigure
[ ] Install Hub and reconfigure
[ ] Install Heroku CLI
[ ] Install Ruby and RVM
[ ] Install Java with Sdkman and configure JAVA_HOME
[ ] Install Nodejs
[ ] Install Postgres with enogrob user
[ ] Install Docker, Docker Compose and Docker Machine
[ ] Install Vim and reconfigure
[ ] Install NVim and reconfigure
[ ] Install todotxt and reconfigure
[ ] Install Things Today and reconfigure
[ ] Install Calibre and reconfigure
[ ] Install Double Commander and reconfigure
[ ] Install Atom and reconfigure
[ ] Install Rubymine and reconfigure
[ ] Install Postman
[ ] Install Compiz and reconfigure
[ ] Install Skype
[ ] Install Slack
[ ] Install Autokey
[ ] Install Shutter
[ ] Install Pinta
[ ] Install Dash compatible for Linux
[ ] Install and run Parallels Transport Agent
[ ] Establish Docker Workflow for development
```
