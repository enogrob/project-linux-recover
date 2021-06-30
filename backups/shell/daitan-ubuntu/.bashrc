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
#shopt login_shell

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
    info_color='\[\033[1;34m\]'
    prompt_symbol=㉿
    if [ "$EUID" -eq 0 ]; then # Change prompt colors for root user
	prompt_color='\[\033[;94m\]'
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
case "$TERM" in
xterm*|rxvt*)
    PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@\h: \w\a\]$PS1"
    ;;
*)
    ;;
esac

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

# some more ls aliases
alias ll='ls -l'
alias la='ls -A'
alias l='ls -CF'
alias google-chrome='google-chrome --password-store=basic'
alias tree='tree -C -L 2'
alias lastrails='gem search rails | grep "^rails "'
alias lastruby='curl -s https://rubies.io/api/normal | jq'
# alias git='hub'

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

# today
test -s  "$HOME/.todayrc.sh" && source "$HOME/.todayrc.sh"

# erlang
test -s $HOME/.kerl/24.0/activate && source $HOME/.kerl/24.0/activate

# elixir
test -s "$HOME/.kiex/scripts/kiex" && source "$HOME/.kiex/scripts/kiex"
test -s "$HOME/.kiex/elixirs/elixir-1.12.1.env" && source "$HOME/.kiex/elixirs/elixir-1.12.1.env"

# obras
# test -s "$HOME/.obras_utils.sh" && source "$HOME/.obras_utils.sh"

# env variables

# trash-cli ~/.local/share/Trash/
export PATH="$PATH":~/.local/bin

# asdf
source $HOME/.asdf/asdf.sh
source $HOME/.asdf/completions/asdf.bash

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"

# daitan
alias kubectl='microk8s.kubectl'
alias fixroute='sudo ip route change 10.127.20.0/24 via 10.227.130.1 && sudo ip route change 10.127.130.0/24 via 10.227.130.1'
#alias fixroute='sudo ip route del 10.127.130.0/24 via 192.168.7.1; sudo ip route del 10.127.20.0/24 via 192.168.7.1
vpn(){
    if ! test -f /usr/local/bin/ansi; then
      echo -e "\033[1;92m==> \033[0m\033[1;39mInstalling \"ansi\" \033[0m"
      echo ""
      curl -OL git.io/ansi
      chmod 755 ansi
      sudo mv ansi /usr/local/bin/
    fi 
    export VPN_VERSION='1.0'
    case $1 in
      --version|-v|v|version)
        ansi --white-intense "Crafted (c) 2021 by Daitan"
        ansi --white --no-newline "Vpn ";ansi --white-intense $VPN_VERSION
        ansi --white "::"
        ansi --no-newline --white "homepage "
        ansi --green --underline "https://github.com/enogrob/vpn"
        ansi --white ""
        ;;
      help|h|--help|-h)
        ansi --white-intense "Crafted (c) 2021 by Daitan"
        ansi --white --no-newline "Vpn ";ansi --white-intense $VPN_VERSION
        ansi --white "::"
        ansi --cyan-intense "vpn " "[on/off/status]"
        ansi --cyan-intense "vpn " "[start/stoken]"
        ansi --no-newline --white "homepage " 
        ansi --underline --green "https://github.com/enogrob/vpn" 
        ansi --white ""
        ;;
      start)
        /opt/paloaltonetworks/globalprotect/PanGPA start&
        ;;
      stoken)
        stoken-gui&
        ;;
      on)
        globalprotect connect -p wr.alameda.windriver.com && fixroute && fixroute
        ;;
      off)
        globalprotect disconnect
        ;;
      *)
        globalprotect show --status
        ;;  
    esac
}

# goto Today
tdy
title
