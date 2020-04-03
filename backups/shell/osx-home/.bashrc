LANG=en_US.US-ASCII;export LANG;LC_TYPE=UTF-8;export LC_TYPE

# git tab completion
test -s /usr/local/etc/bash_completion.d/git-completion.bash && source /usr/local/etc/bash_completion.d/git-completion.bash
test -s /usr/local/etc/bash_completion.d/git-prompt.sh && source /usr/local/etc/bash_completion.d/git-prompt.sh

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
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_241.jdk/Contents/Home

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
# alias vim='vim --servername VIM'

# obras
test -s "$HOME/.obras_osx.sh" && source "$HOME/.obras_osx.sh"

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
test -s  "$HOME/.todayrc.sh" && source "$HOME/.todayrc.sh"

# erlang
#. /Users/enogrob/kerl/20.2/activate
#source $HOME/.evm/scripts/evm

# java
export SDKMAN_DIR="$HOME/.sdkman"
test -s "$HOME/.sdkman/bin/sdkman-init.sh" && source "$HOME/.sdkman/bin/sdkman-init.sh"
# elixir
test -s "$HOME/.kiex/scripts/kiex" && source "$HOME/.kiex/scripts/kiex"
# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"
