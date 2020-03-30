export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced

[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*

#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="/Users/enogrob/.sdkman"
[[ -s "/Users/enogrob/.sdkman/bin/sdkman-init.sh" ]] && source "/Users/enogrob/.sdkman/bin/sdkman-init.sh"
