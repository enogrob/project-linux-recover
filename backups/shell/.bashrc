LANG=;export LANG;LC_TYPE=UTF-8;export LC_TYPE

# Git Tab completion
source ~/git-completion.bash
# prompt show branch in status line
PS1='\e[35;1m[\W$(__git_ps1 " (%s)")]\$\e[0m '
export PROMPT_COMMAND='echo -ne "\033]0;${PWD/#$HOME/~}\007"'

export LESS_TERMCAP_mb=$(printf '\e[01;31m') # enter blinking mode – red
export LESS_TERMCAP_md=$(printf '\e[01;35m') # enter double-bright mode – bold, magenta
export LESS_TERMCAP_me=$(printf '\e[0m') # turn off all appearance modes (mb, md, so, us)
export LESS_TERMCAP_se=$(printf '\e[0m') # leave standout mode
export LESS_TERMCAP_so=$(printf '\e[01;33m') # enter standout mode – yellow
export LESS_TERMCAP_ue=$(printf '\e[0m') # leave underline mode
export LESS_TERMCAP_us=$(printf '\e[04;36m') # enter underline mode – cyan

EDITOR=vim
export EDITOR
export ERL_AFLAGS="-kernel shell_history enabled"

# aliases general
alias h='history | tail'
alias komodo='open -a "Komodo IDE 8" .'
alias rstudio='open -a RStudio .'
alias excel='open -a "Microsoft Excel"'
alias psty='~/bin/psty.py -a -d /Users/enogrob/psty'
alias shellinit='$(boot2docker shellinit);printenv DOCKER_HOST'
alias top='top -o cpu'
alias shutdown='shutdown -r now'
alias airport='airport -s'
alias ps='ps aux'
alias mytap='cd /usr/local/Library/Taps/caskroom/;open -g .'
alias tree='tree -C -L 2'
alias cypher='/usr/local/Cellar/neo4j/3.1.0/libexec/bin/cypher-shell -u neo4j -p betoz23'
alias browser-sync='browser-sync --start --directory --files "**/*"'

export LOCAL_USER_ID=$(id -u)
alias dk='docker'
alias dki='docker image'
alias dkis='docker images'
alias dkc='docker container'

alias dc='docker-compose'
alias dc-web='docker-compose run web'
alias dc-app='docker-compose run app'
alias dc-rails='docker-compose run web rails'
alias dc-rspec='docker-compose run web rspec'
alias dc-rake='docker-compose run web rake'
alias dc-test='docker-compose run web rake test'
alias dc-dashing='docker-compose run web dashing'
alias code='code --disable-gpu .&'

function dkimportdb(){
  docker-compose exec $1 bundle exec rake db:drop
  docker-compose exec $1 bundle exec rake db:create
  docker exec -i db mysql -uroot -proot $2 < $3
  docker-compose exec $1 bundle exec rake db:migrate
}

function importdb(){
  rake db:drop
  rake db:create
  mysql -u root -p $MYSQL_DATABASE_DEV < $1
  rake db:migrate
}

function db(){
  echo $MYSQL_DATABASE_DEV
  echo $MYSQL_DATABASE_TST
}

function setdb(){
  set -o allexport
  . ./.env/development/$1
  set +o allexport
}

# function in order to control spotlight workers
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

function dash(){
  open dash://$1:$2
}

# function in order to control CalendarAgent
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

# aliases vim
alias vim='vim --servername VIM'
alias ct='ctags -R -V --exclude=.git --exclude=.idea'
alias git='hub'
alias mysql='mysql -u root'

# aliases repl
alias jsc="/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Resources/jsc"
alias icpp='igcc'
alias ijava='javarepl'
alias ijavascript='jsc'
alias ir='r --no-save --quiet'
alias iperl='re.pl'
alias ifortran='python -m fytran'
alias icling='/Users/enogrob/bin/cling/inst/bin/cling'
alias iclosure='java -jar ~/bin/clojure-1.8.0/clojure-1.8.0.jar'

# help function to get the repl for a language
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

#perl 5 envs
PERL_MB_OPT="--install_base \"/Users/enogrob/perl5\""; export PERL_MB_OPT;
PERL_MM_OPT="INSTALL_BASE=/Users/enogrob/perl5"; export PERL_MM_OPT;

# bash: Place this in .bashrc.
function iterm2_print_user_vars() {
  iterm2_set_user_var gitBranch $((git branch 2> /dev/null) | grep \* | cut -c3-)
}

# python envs
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/Projects
source ~/Library/Python/2.7/bin/virtualenvwrapper.sh

source ~/.todayrc.sh

. /Users/enogrob/kerl/20.2/activate
source $HOME/.evm/scripts/evm

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="/Users/enogrob/.sdkman"
[[ -s "/Users/enogrob/.sdkman/bin/sdkman-init.sh" ]] && source "/Users/enogrob/.sdkman/bin/sdkman-init.sh"

# Load RVM into a shell session *as a function*
export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
export RAILS_ENV=development
export MYSQL_DATABASE_DEV=demo_dev
export MYSQL_DATABASE_TST=demo_tst
export RUBYOPT=-W0