#!/bin/bash
# obras

# variables
export CPPFLAGS="-I/usr/local/opt/mysql@5.7/include"
export LDFLAGS="-L/usr/local/opt/mysql@5.7/lib"
export MYSQL_DATABASE_DEV=demo_dev
export MYSQL_DATABASE_TST=demo_tst
export PATH="/usr/local/opt/mysql@5.7/bin:$PATH"
# export RAILS_ENV=demo
export RUBYOPT=-W0

# aliases development
alias code='code --disable-gpu .&'
alias mysql='mysql -u root'
alias obras='cd $HOME/Projects/obras' 
alias rc='rvm current'

# aliases docker
alias dc='docker-compose'
alias dk='docker'
alias dkc='docker container'
alias dki='docker image'
alias dkis='docker images'

# functions
function restart_mysql {
  FILE=$HOME/Library/LaunchAgents/homebrew.mxcl.mysql@5.7.plistnf
  if test -f "$FILE"; then
    unload ~/Library/LaunchAgents/homebrew.mxcl.mysql@5.7.plist
    rm ~/Library/LaunchAgents/homebrew.mxcl.mysql@5.7.plist
    brew services start mysql@5.7
  else  
    brew services restart mysql@5.7
  fi
  brew services list
}

function importdb(){
  rails db:environment:set RAILS_ENV=development
  rails db:drop
  rails db:create
  mysql -u root -p $MYSQL_DATABASE_DEV < $1
  rails db:migrate
}

function dkimportdb(){
  docker-compose exec $1 bundle exec rails db:environment:set RAILS_ENV=$RAILS_ENV
  docker-compose exec $1 bundle exec rails db:drop
  docker-compose exec $1 bundle exec rails db:drop
  docker-compose exec $1 bundle exec rails db:create
  docker exec -i db mysql -uroot -proot $2 < $3
  docker-compose exec $1 bundle exec rails db:migrate
}

function db(){
  echo $MYSQL_DATABASE_DEV
  echo $MYSQL_DATABASE_TST
}

function setdb(){
  set -o allexport
  . ./.env/development/$1
  set +o allexport
  db
}

function dash(){
  open dash://$1:$2
}