#!/bin/bash
# obras

# variables
export CPPFLAGS="-I/usr/local/opt/mysql@5.7/include"
export LDFLAGS="-L/usr/local/opt/mysql@5.7/lib"
export SITE=demo
export MYSQL_DATABASE_DEV=demo_dev
export MYSQL_DATABASE_TST=demo_tst
export PATH="/usr/local/opt/mysql@5.7/bin:$PATH"
export RAILS_ENV=development
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
mysql_ls(){
  brew services list
}

__pr(){
    if [ $# -eq 0 ]; then
        echo -e ""
    elif [ $# -eq 2 ]; then
        case $1 in
            dang|red)
                echo -e "\033[31m$2 \033[0m"
                ;;
            succ|green)
                echo -e "\033[32m$2 \033[0m"
                ;;
            warn|yellow)
                echo -e "\033[33m$2 \033[0m"
                ;;
            info|blue)
                echo -e "\033[34m$2 \033[0m"
                ;;
            bold|white)
                echo -e "\033[1;39m$2 \033[0m"
                ;;
        esac
    elif [ $# -eq 3 ]; then
        case $1 in
            dang|red)
                echo -e "$2 \033[31m$3 \033[0m"
                ;;
            succ|green)
                echo -e "$2 \033[32m$3 \033[0m"
                ;;
            warn|yellow)
                echo -e "$2 \033[33m$3 \033[0m"
                ;;
            info|blue)
                echo -e "$2 \033[36m$3 \033[0m"
                ;;
            bold|white)
                echo -e "$2 \033[1;39m$3 \033[0m"
                ;;
        esac
    else
        __pr red "=> Error: Bad number of arguments."
        __pr
        return 1
    fi
}

function restart_mysql {
  FILE=$HOME/Library/LaunchAgents/homebrew.mxcl.mysql@5.7.plistnf
  if test -f "$FILE"; then
    unload ~/Library/LaunchAgents/homebrew.mxcl.mysql@5.7.plist
    rm ~/Library/LaunchAgents/homebrew.mxcl.mysql@5.7.plist
  fi 
  brew services stop mysql@5.7
  brew services start mysql@5.7
  brew services list
}

function initdb(){
  rake db:drop
  rake db:create
  rake db:migrate
  rake db:seed
}

function importdb(){
  rake db:drop
  rake db:create
  mysql -u root -p $MYSQL_DATABASE_DEV < $1
  rake db:migrate
}

function dkimportdb(){
  docker-compose exec $1 bundle exec rake db:drop
  docker-compose exec $1 bundle exec rake db:drop
  docker-compose exec $1 bundle exec rake db:create
  docker exec -i db mysql -uroot -proot $2 < $3
  docker-compose exec $1 bundle exec rake db:migrate
}

function db(){
  __pr succ "Database Dev:" $MYSQL_DATABASE_DEV 
  __pr succ "Database Tst:" $MYSQL_DATABASE_TST 
  __pr
}

function site(){
  __pr info "Proj:" $(basename $PWD)
  __pr bold "Site:" $SITE
  __pr dang "Rvm :" $(rvm current)
  __pr warn "Env :" $RAILS_ENV
  db
}

function setdb(){
  set -o allexport
  . ./.env/development/$1
  set +o allexport
}

function dash(){
  open dash://$1:$2
}

function settitle(){
  SITE=$1
  export PROMPT_COMMAND='echo -ne "\033]0;${SITE##*/}\007"'
}

function setsite {
  unset SITE
  export SITE=$1
  case $1 in
    santoandre|olimpia|demo)
      cd "$HOME/Projects/obras"
      setdb $1
      settitle $1
      site
      ;;
    rioclaro|suzano)
      cd "$HOME/Logbook/obras"
      setdb $1
      settitle $1
      site
      ;;
    *) 
      __pr dang "=> Error: Bad site "$1
      __pr
      return 1
      ;;
  esac
}