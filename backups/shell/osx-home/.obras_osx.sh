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
alias enogrob='cd $HOME' 
alias downloads='cd $HOME/Downloads' 
alias code='code --disable-gpu .&'
alias mysql='mysql -u root'
alias olimpia='site set olimpia' 
alias rioclaro='site set rioclaro' 
alias suzano='site set suzano' 
alias santoandre='site set santoandre' 
alias demo='site set demo' 
alias rc='rvm current'

# aliases docker
alias dc='docker-compose'
alias dk='docker'
alias dkc='docker container'
alias dki='docker image'
alias dkis='docker images'

# functions
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

function dash(){
  open dash://$1:$2
}

function title(){
  SITE=$1
  export PROMPT_COMMAND='echo -ne "\033]0;${SITE##*/}\007"'
}

function db(){
  case $1 in 
    init)
      rake db:drop
      rake db:create
      rake db:migrate
      rake db:seed
      ;;

    import)
      if test -f "$2"; then
        rake db:drop
        rake db:create
        __pr info "file: " $($2)
        mysql -u root -p $MYSQL_DATABASE_DEV < $2
        rake db:migrate
      else 
        FILE=$(find . -iname *$SITE.sql) 
        if test -f "$FILE"; then
          rake db:drop
          rake db:create
          __pr info "file: " $(basename $FILE)
          mysql -u root -p $MYSQL_DATABASE_DEV < $FILE
          rake db:migrate
        else
          __pr dang "=> Error: Bad file "$2
          __pr
          return 1
        fi  
      fi
      ;;

    docker) 
      if test -f "$3"; then
        docker-compose exec $2 bundle exec rake db:drop
        docker-compose exec $2 bundle exec rake db:drop
        docker-compose exec $2 bundle exec rake db:create
        __pr info "file: " $(basename $3)
        docker exec -i db mysql -uroot -proot $MYSQL_DATABASE_DEV < $3
        docker-compose exec $2 bundle exec rake db:migrate
      else  
        __pr dang "=> Error: Bad file "$3
        __pr
        return 1
      fi
      ;; 

    restart)
      FILE=$HOME/Library/LaunchAgents/homebrew.mxcl.mysql@5.7.plistnf
      if test -f "$FILE"; then
        unload ~/Library/LaunchAgents/homebrew.mxcl.mysql@5.7.plist
        rm ~/Library/LaunchAgents/homebrew.mxcl.mysql@5.7.plist
        brew services start mysql@5.7
      else  
        brew services stop mysql@5.7
        brew services start mysql@5.7
      fi 
      brew services list
      ;;

    set)
      case $2 in 
        olimpia|rioclaro|suzano|santoandre|demo)
          set -o allexport
          . ./.env/development/$2
          set +o allexport
          ;;

        *)
          __pr dang "=> Error: Bad site "$2
          __pr
          return 1
          ;;
      esac
      ;;

    status)
      brew services list
      ;;

    *)
      __pr succ "db_dev:" $MYSQL_DATABASE_DEV 
      __pr succ "db_tst:" $MYSQL_DATABASE_TST 
      FILE=$(find . -iname *$SITE.sql) 
      if test -f "$FILE"; then
      __pr info "db_sql:" $(basename $FILE)
      else
      __pr dang "db_sql:" "no file"
      fi
      __pr
      ;;
  esac
}

function site(){
  case $1 in
    set)
      case $2 in 
        olimpia|santoandre|demo)
          export SITE=$2
          cd "$HOME/Projects/obras"
          db set $2
          title $2
          site
          ;;

        rioclaro|suzano)
          export SITE=$2
          cd "$HOME/Logbook/obras"
          db set $2
          title $2
          site
          ;;
        *)
          __pr dang "=> Error: Bad site "$2
          __pr
          return 1
          ;;
      esac
      ;;

    *)
      __pr bold "site:" $SITE
      __pr bold "dir :" $PWD
      __pr dang "rvm :" $(rvm current)
      __pr warn "env :" $RAILS_ENV
      db
      ;;
  esac
}
