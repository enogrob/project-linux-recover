LANG=en_US.US-ASCII;export LANG;LC_TYPE=UTF-8;export LC_TYPE

# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# git tab completion
test -s /usr/local/etc/bash_completion.d/git-completion.bash && source /usr/local/etc/bash_completion.d/git-completion.bash
test -s /usr/local/etc/bash_completion.d/git-prompt.sh && source /usr/local/etc/bash_completion.d/git-prompt.sh

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# If set, the pattern "**" used in a pathname expansion context will
# match all files and zero or more directories and subdirectories.
#shopt -s globstar

# make less more friendly for non-text input files, see lesspipe(1)
#[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# set a fancy prompt (non-color, unless we know we "want" color)
case "$TERM" in
    xterm-color|*-256color) color_prompt=yes;;
esac

# uncomment for a colored prompt, if the terminal has the capability; turned
# off by default to not distract the user: the focus in a terminal window
# should be on the output of commands, not on the prompt
force_color_prompt=yes

if [ -n "$force_color_prompt" ]; then
    if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
	# We have color support; assume it's compliant with Ecma-48
	# (ISO/IEC-6429). (Lack of such support is extremely rare, and such
	# a case would tend to support setf rather than setaf.)
	color_prompt=yes
    else
	color_prompt=
    fi
fi


if [ "$color_prompt" = yes ]; then
    # override default virtualenv indicator in prompt
    VIRTUAL_ENV_DISABLE_PROMPT=1

    prompt_color='\[\033[;32m\]'
    info_color='\[\033[1;35m\]'
    prompt_symbol=㉿
    if [ "$EUID" -eq 0 ]; then # Change prompt colors for root user
	prompt_color='\[\033[;95m\]'
	info_color='\[\033[1;31m\]'
	prompt_symbol=💀
    fi
    PS1=$prompt_color'┌──${debian_chroot:+($debian_chroot)──}${VIRTUAL_ENV:+(\[\033[0;1m\]$(basename $VIRTUAL_ENV)'$prompt_color')}('$info_color'\u${prompt_symbol}\h'$prompt_color')-[\[\033[0;1m\]\W'$prompt_color']$(__git_ps1)\n'$prompt_color'└─'$info_color'\$\[\033[0m\] '
    # BackTrack red prompt
    #PS1='${VIRTUAL_ENV:+($(basename $VIRTUAL_ENV)) }${debian_chroot:+($debian_chroot)}\[\033[01;31m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
else
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
fi
unset color_prompt force_color_prompt

# If this is an xterm set the title to user@host:dir
# case "$TERM" in
# xterm*|rxvt*)
#     PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@\h: \w\a\]$PS1"
#     ;;
# *)
#     ;;
# esac

# enable color support of ls, less and man, and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    #alias dir='dir --color=auto'
    #alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
    alias diff='diff --color=auto'
    alias ip='ip --color=auto'

    export LESS_TERMCAP_mb=$'\E[1;31m'     # begin blink
    export LESS_TERMCAP_md=$'\E[1;36m'     # begin bold
    export LESS_TERMCAP_me=$'\E[0m'        # reset bold/blink
    export LESS_TERMCAP_so=$'\E[01;33m'    # begin reverse video
    export LESS_TERMCAP_se=$'\E[0m'        # reset reverse video
    export LESS_TERMCAP_us=$'\E[1;32m'     # begin underline
    export LESS_TERMCAP_ue=$'\E[0m'        # reset underline
fi

# colored GCC warnings and errors
#export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01:quote=01'

# env variables
export EDITOR=vim
export ERL_AFLAGS="-kernel shell_history enabled"

# For compilers to find icu4c you may need to set:
#export LDFLAGS="-L/usr/local/opt/icu4c/lib"
#export CPPFLAGS="-I/usr/local/opt/icu4c/include"

export LESS_TERMCAP_mb=$(printf '\e[01;31m') # enter blinking mode – red
export LESS_TERMCAP_md=$(printf '\e[01;35m') # enter double-bright mode – bold, magenta
export LESS_TERMCAP_me=$(printf '\e[0m') # turn off all appearance modes (mb, md, so, us)
export LESS_TERMCAP_se=$(printf '\e[0m') # leave standout mode
export LESS_TERMCAP_so=$(printf '\e[01;33m') # enter standout mode – yellow
export LESS_TERMCAP_ue=$(printf '\e[0m') # leave underline mode
export LESS_TERMCAP_us=$(printf '\e[04;36m') # enter underline mode – cyan
export LOCAL_USER_ID=$(id -u)
export PROMPT_COMMAND='echo -ne "\033]0;${PWD/#$HOME/~}\007"'
#export CFLAGS="-O2 -g -fno-stack-check"
export KERL_CONFIGURE_OPTIONS="--disable-hipe --with-ssl=$(brew --prefix openssl)"
#export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_241.jdk/Contents/Home

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
alias lastrails='gem search rails | grep "^rails "'
alias lastruby='curl -s https://rubies.io/api/normal | jq'

test -f /usr/local/bin/exa && alias exals="exa -lhgbH --git"
test -f /usr/local/bin/exa && alias exala="exa -lahgbH --git"

# alias vim='vim --servername VIM'

# obras
test -f "$HOME/Projects/research-obras-devtools/obras/.obras_utils.sh" && source "$HOME/Projects/research-obras-devtools/obras/.obras_utils.sh"

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

source <(kubectl completion bash) # setup autocomplete in bash into the current shell, bash-completion package should be installed first.

# today
test -s  "$HOME/Projects/project-things-today/.todayrc_vars.sh" && source "$HOME/Projects/project-things-today/.todayrc_vars.sh"
test -s  "$HOME/Projects/project-things-today/.todayrc.sh" && source "$HOME/Projects/project-things-today/.todayrc.sh"

# erlang
test -s $HOME/.kerl/23.0/activate && source $HOME/.kerl/23.0/activate

#source $HOME/.evm/scripts/evm

# elixir
test -s "$HOME/.kiex/scripts/kiex" && source "$HOME/.kiex/scripts/kiex"
test -s "$HOME/.kiex/elixirs/elixir-1.10.4.env" && source "$HOME/.kiex/elixirs/elixir-1.10.4.env"
# java
#export SDKMAN_DIR="$HOME/.sdkman"
#test -s "$HOME/.sdkman/bin/sdkman-init.sh" && source "$HOME/.sdkman/bin/sdkman-init.sh"
# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin:/Users/enogrob/Library/Python/2.7/bin"

# source $HOME/.os_parrot.sh

# Created by `userpath` on 2020-09-20 12:32:59
export PATH="$PATH:/Users/enogrob/.local/bin"

