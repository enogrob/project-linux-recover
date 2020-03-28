LANG=;export LANG;LC_TYPE=UTF-8;export LC_TYPE

# git tab completion
source /usr/local/etc/bash_completion.d/git-completion.bash
source /usr/local/etc/bash_completion.d/git-prompt.sh

# prompt show branch in status line
PS1='\e[35;1m[\W$(__git_ps1 " (%s)")]\$\e[0m '

# env variables
export EDITOR=vim
export ERL_AFLAGS="-kernel shell_history enabled"
export LESS_TERMCAP_mb=$(printf '\e[01;31m') # enter blinking mode – red
export LESS_TERMCAP_md=$(printf '\e[01;35m') # enter double-bright mode – bold, magenta
export LESS_TERMCAP_me=$(printf '\e[0m') # turn off all appearance modes (mb, md, so, us)
export LESS_TERMCAP_se=$(printf '\e[0m') # leave standout mode
export LESS_TERMCAP_so=$(printf '\e[01;33m') # enter standout mode – yellow
export LESS_TERMCAP_ue=$(printf '\e[0m') # leave underline mode
export LESS_TERMCAP_us=$(printf '\e[04;36m') # enter underline mode – cyan
export LOCAL_USER_ID=$(id -u)
export PROMPT_COMMAND='echo -ne "\033]0;${PWD/#$HOME/~}\007"'

# aliases general
alias airport='airport -s'
alias browser-sync='browser-sync --start --directory --files "**/*"'
alias ct='ctags -R -V --exclude=.git --exclude=.idea'
alias cypher='/usr/local/Cellar/neo4j/3.1.0/libexec/bin/cypher-shell -u neo4j -p betoz23'
alias excel='open -a "Microsoft Excel"'
alias git='hub'
alias h='history | tail'
alias icling='/Users/enogrob/bin/cling/inst/bin/cling'
alias iclosure='java -jar ~/bin/clojure-1.8.0/clojure-1.8.0.jar'
alias icpp='igcc'
alias ifortran='python -m fytran'
alias ijava='javarepl'
alias ijavascript='jsc'
alias iperl='re.pl'
alias ir='r --no-save --quiet'
alias jsc="/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Resources/jsc"
alias mytap='cd /usr/local/Library/Taps/caskroom/;open -g .'
alias ps='ps aux'
alias psty='~/bin/psty.py -a -d /Users/enogrob/psty'
alias rstudio='open -a RStudio .'
alias shellinit='$(boot2docker shellinit);printenv DOCKER_HOST'
alias shutdown='shutdown -r now'
alias top='top -o cpu'
alias tree='tree -C -L 2'
alias vim='vim --servername VIM'


# obras
# variables
export CPPFLAGS="-I/usr/local/opt/mysql@5.7/include"
export LDFLAGS="-L/usr/local/opt/mysql@5.7/lib"
export MYSQL_DATABASE_DEV=demo_dev
export MYSQL_DATABASE_TST=demo_tst
export PATH="/usr/local/opt/mysql@5.7/bin:$PATH"
export RAILS_ENV=development
export RUBYOPT=-W0

# aliases
alias code='code --disable-gpu .&'
alias dc='docker-compose'
alias dk='docker'
alias dkc='docker container'
alias dki='docker image'
alias dkis='docker images'
alias mysql='mysql -u root'
alias obras='cd ~/Projects/obras' 
alias rc='rvm current'

# functions
function importdb(){
  rake db:drop
  rake db:create
  mysql -u root -p $MYSQL_DATABASE_DEV < $1
  rake db:migrate
}
function importdb_dk(){
  docker-compose exec $1 bundle exec rake db:drop
  docker-compose exec $1 bundle exec rake db:create
  docker exec -i db mysql -uroot -proot $2 < $3
  docker-compose exec $1 bundle exec rake db:migrate
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


# macbook
function spotlight(){
    case $1 in
        status)
        mdutil -s /Volumes/Macintosh\ HD
        ;;
        on)
        sudo mdutil -a -i on
        ;;
        off)
        sudo mdutil -a -i off
        ;;
    esac
}
function tasks(){
    case $1 in
        list)
        CA_LOADED=`launchctl list | grep CalendarAgent`;
        if [[ $CA_LOADED == *"CalendarAgent"* ]]
        then
          echo "CalendarAgent is loaded.";
          echo "";
          /usr/local/bin/icalBuddy -f tasksDueBefore:today+1;
        else
          echo "CalendarAgent is not loaded.";
        fi
        ;;

        on)
        CA_LOADED=`launchctl list | grep CalendarAgent`;
        if [[ $CA_LOADED == *"CalendarAgent"* ]]
        then
          echo "CalendarAgent is already loaded.";
          echo "";
        else
          launchctl load -w /System/Library/LaunchAgents/com.apple.CalendarAgent.plist
          tasks status;
        fi
        ;;

        off)
        CA_LOADED=`launchctl list | grep CalendarAgent`;
        if [[ $CA_LOADED == *"CalendarAgent"* ]]
        then
          launchctl unload -w /System/Library/LaunchAgents/com.apple.CalendarAgent.plist
          tasks status;
        else
          echo "CalendarAgent is already unloaded.";
          echo "";
        fi
        ;;

        status|*)
        CA_LOADED=`launchctl list | grep CalendarAgent`;
        if [[ $CA_LOADED == *"CalendarAgent"* ]]
        then
          echo "CalendarAgent is loaded.";
          echo "";
        else
          echo "CalendarAgent is not loaded.";
          echo "";
        fi
        ;;
    esac
}
function repl(){
  case $1 in
    java) javarepl;;
    javascript) jsc;;
    c++) icling;;
    cpp) igcc;;
    perl) re.pl;;
    r) r --no-save --quiet;;
    fortran) python -m fytran;;
    closure) closure;;
    julia) julia;;
    ruby) pry;;
    *) echo "repls:";
       echo "java       ";
       echo "javascirpt ";
       echo "c++        ";
       echo "cpp        ";
       echo "perl       ";
       echo "r          ";
       echo "fortran    ";
       echo "closure    ";
       echo "julia      ";
       echo "ruby       ";
       ;;
  esac
}
tab() {
    osascript &>/dev/null <<EOF
      tell application "iTerm"
        activate
        tell current window to set tb to create tab with default profile
      end tell
EOF
}
function iterm2_print_user_vars() {
  iterm2_set_user_var gitBranch $((git branch 2> /dev/null) | grep \* | cut -c3-)
}


# today
source ~/.todayrc.sh


# lang managers
#. /Users/enogrob/kerl/20.2/activate
#source $HOME/.evm/scripts/evm

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
#export SDKMAN_DIR="/Users/enogrob/.sdkman"
#[[ -s "/Users/enogrob/.sdkman/bin/sdkman-init.sh" ]] && source "/Users/enogrob/.sdkman/bin/sdkman-init.sh"

# Load RVM into a shell session *as a function*
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting