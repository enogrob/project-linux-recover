# .bashrc
[[ $- == *i* ]] || return

# User specific aliases and functions

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

export PATH=$PATH:~/bin
export LC_TIME=en_US.UTF-8
export TERM=xterm-256color

source ~/env.wrcp_dev
source ~/Projects/goto/goto.sh
