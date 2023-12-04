LANG=en_US.US-ASCII;export LANG;LC_TYPE=UTF-8;export LC_TYPE
export LC_ALL=en_US.utf-8
export LANG=en_US.utf-8

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

# For compilers to find mysql@5.7 you may need to set:
# export LDFLAGS="-L/usr/local/opt/mysql@5.7/lib"
# export CPPFLAGS="-I/usr/local/opt/mysql@5.7/include"

# For pkg-config to find mysql@5.7 you may need to set:
# export PKG_CONFIG_PATH="/usr/local/opt/mysql@5.7/lib/pkgconfig"

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

# enable colors
export GREP_OPTIONS='--color=auto' GREP_COLOR='1;32'
export CLICOLOR=1
export LSCOLORS=ExFxCxDxBxegedabagacad

# aliases general
alias airport='airport -s'
alias ct='ctags -R -V --exclude=.git --exclude=.idea'
# alias cypher='/usr/local/Cellar/neo4j/3.1.0/libexec/bin/cypher-shell -u neo4j -p betoz23'
alias excel='open -a "Microsoft Excel"'
# alias git='hub'
alias h='history | tail'
# alias icling='/Users/enogrob/bin/cling/inst/bin/cling'
# alias iclosure='java -jar ~/bin/clojure-1.8.0/clojure-1.8.0.jar'
# alias icpp='igcc'
# alias ifortran='python -m fytran'
# alias ijava='javarepl'
# alias ijavascript='jsc'
# alias iperl='re.pl'
# alias ir='r --no-save --quiet'
# alias jsc="/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Resources/jsc"
# alias mytap='cd /usr/local/Library/Taps/caskroom/;open -g .'
alias ps='ps aux'
alias psty='~/bin/psty.py -a -d /Users/enogrob/psty'
# alias rstudio='open -a RStudio .'
# alias shellinit='$(boot2docker shellinit);printenv DOCKER_HOST'
alias shutdown='shutdown -r now'
alias top='top -o cpu'
alias tree='tree -C -L 2'
alias lastrails='gem search rails | grep "^rails "'
alias lastruby='curl -s https://rubies.io/api/normal | jq'
alias tdgr='git log --grep=RISK --pretty=format:"%h%x09%an%x09%ad%x09%s" | head'
alias tdglc='git log -1 --oneline --name-only `git branch --show-current`'

test -f /usr/local/bin/exa && alias exals="exa -lhgbH --git"
test -f /usr/local/bin/exa && alias exala="exa -lahgbH --git"

# alias vim='vim --servername VIM'

# obras
#test -f "$HOME/Projects/research-obras-devtools/obras/.obras_utils.sh" && source "$HOME/Projects/research-obras-devtools/obras/.obras_utils.sh"

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

#source <(kubectl completion bash) # setup autocomplete in bash into the current shell, bash-completion package should be installed first.

# today
test -f  "$HOME/Projects/project-things-today/.todayrc_vars.sh" && source "$HOME/Projects/project-things-today/.todayrc_vars.sh"
test -f  "$HOME/Projects/project-things-today/.todayrc.sh" && source "$HOME/Projects/project-things-today/.todayrc.sh"
test -f  "$HOME/Projects/project-things-today/.todayrc.sh" && alias today='pushd "$HOME/Projects/project-things-today";tdyea;tdyia;clear;tdss;title'
test -f  "$HOME/Projects/project-things-today/.todayrc.sh" && unalias tdy && alias tdy='things today;title;clear'

# rails site manager
export PUPPET_USER=rnogueira
export PUPPET_PASS=Puppet#22.
test -f  "$HOME/Projects/rails-site-manager/site" && source "$HOME/Projects/rails-site-manager/site"
git.domain.justworks.init "Roberto Nogueira" "rnogueira@justworks.com"
git.domain.gmail.init "Roberto Nogueira" "enogrob@gmail.com"

test -d  "$HOME/Projects/clockwork_web" && alias web='pushd $HOME/Projects/clockwork_web;nvm use v14.19.3;title;clear;site'
test -d  "$HOME/Projects/clockwork_web" && alias face='pushd $HOME/Projects/clockface;nvm use v18.17.1;title;clear'
test -d  "$HOME/Projects/clockwork_web" && alias secrets='pushd /opt/secrets/current'
test -d  "$HOME/Projects/clockwork_web" && alias start-web='bundle exec rails server'
test -d  "$HOME/Projects/clockwork_web" && alias start-worker='bundle exec sidekiq --config config/sidekiq_dev.yml'
test -d  "$HOME/Projects/clockwork_web" && alias start-assets='yarn watch --env.no-lint'
test -d  "$HOME/Projects/clockwork_web" && alias start-assets='yarn watch --env.no-lint'

test -d  "$HOME/Projects/clockwork_web" && alias tdgb='git branch --sort=-committerdate | head'

# ruby
# export RUBYOPT=-w

# erlang
test -s $HOME/.kerl/23.0/activate && source $HOME/.kerl/23.0/activate

# source $HOME/.evm/scripts/evm

# elixir
test -s "$HOME/.kiex/scripts/kiex" && source "$HOME/.kiex/scripts/kiex"
test -s "$HOME/.kiex/elixirs/elixir-1.10.4.env" && source "$HOME/.kiex/elixirs/elixir-1.10.4.env"
# java
# export SDKMAN_DIR="$HOME/.sdkman"
# test -s "$HOME/.sdkman/bin/sdkman-init.sh" && source "$HOME/.sdkman/bin/sdkman-init.sh"

# source $HOME/.os_parrot.sh

# Created by `userpath` on 2020-09-20 12:32:59
export PATH="$PATH:/Users/robertonogueira/.local/bin"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

source /opt/secrets/current/dev_env_exports.sh

# fasd
eval "$(fasd --init auto)"
bind '"\e[A": history-search-backward'
bind '"\e[B": history-search-forward'

# aws
# export AWS_ACCESS_KEY_ID="ASIARVIMX2VTC433GA4I"
# export AWS_SECRET_ACCESS_KEY="7lEi8EsxjOO5MfPH1FjUx51mvwWEq6RL0/1SB72q"
# export AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEFMaCXVzLWVhc3QtMSJHMEUCIQDQeTd3tMFJC505kC6KHuw2T/TTkr7j0vyOfyLDQYsx+gIgfFIVzzAhj9NG/1NWkxwlxECOW8ECFQKhmXgif8UKYMcqjQMISxAAGgwxMTQzODAyMzIwMzgiDFnS0q+GM+N4s0tr9SrqAgTdC0e1X2Mp3criECEuk6395qTpDPWbhYdJmlUXJOZgFjnx91Vt41v+pm2B9IqEpDw0kydGxaU/LnUXNHusbejReFFFGXkK70fQdBO1XAMJjEYwSWo2h7qWI2/KnvdboCUqPrXYOFYhUoOWj/jTJthFWOppM2QH09b8q+e6HwjO/2uV3p1/F1D03USgBrmX/EkcxSftoKFpiPWCh258TlyegZm+9p1JpeNdb6hEqP/Dift98NtQCErD6C0Z+/kaaeaGvdAOJq/16Q0rqht2Agxg7Ju95rpJE4GIoc4yXSHPq2hJaXIixmAMRgzaW86B7tzd433pC4QhbGn+okR6mKLRKYJvGd9TJB1PoRnyYvb89O/9g8vh5JIHR7HvnAocLDNvVVmHqY3Y1Q9u2AVNyJ4fQkbgZWTUbgLHKigA2ErwnpEMAmUtbwzj3BQSNUoBtmhV5WyAk8UYJluOliNrs+WHa3ldkOuHZVo3MKOa9qEGOqYBfUr98zucAIc2vpFh5qk0J/MtiRrk2NUW3rZbad6vSxAYOPikxpeQ9HCZH7OefLaH/H9cxpJWSrMtnKiGWGokY0mXAN+zCzwOwA2n0h/lPG10UeLXzGykSbJTmF6+sS9DgOuuJt+o6nzX0damJEsxo3c5Ic7gAvgCQweePE9YQMZ9ccyz/y02GYX69Zh3sTjuZ3aP/JffgBlOMWSvYa1JWjopcU5RJQ=="
# export AWS_PROFILE=infra-sandbox
# rvm
PATH="$GEM_HOME/bin:$HOME/.rvm/bin:$PATH"
[ -s ${HOME}/.rvm/scripts/rvm ] && source ${HOME}/.rvm/scripts/rvm
