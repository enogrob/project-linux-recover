" install plugins
execute pathogen#infect()

nnoremap <silent> <ESC>OA <Nop>
nnoremap <silent> <ESC>OB <Nop>
nnoremap <silent> <ESC>OC <Nop>
nnoremap <silent> <ESC>OD <Nop>
inoremap <silent> <ESC>OA <Nop>
inoremap <silent> <ESC>OB <Nop>
inoremap <silent> <ESC>OC <Nop>
inoremap <silent> <ESC>OD <Nop>

" set default charset
set encoding=utf-8
set termencoding=utf-8

" disable .swap files
set noswapfile

" autoreload files
set autoread

" indentation
set autoindent
set smartindent
set smarttab
set copyindent
set ts=2                " number of spaces in a tab
set sw=2                " number of spaces for indent
set et                  " expand tabs into spaces

" highlight settings
set incsearch
set hlsearch
set ignorecase
set smartcase

" enable syntax highlight
filetype plugin indent on
syntax on

" prevent vim from adding that stupid empty line at the end of every file
set noeol
set binary

" presentation settings
set number              " precede each line with its line number
set relativenumber      " relavive numbers are show
set numberwidth=3       " number of culumns for line numbers
set textwidth=0         " Do not wrap words (insert)
set nowrap              " Do not wrap words (view)
set showcmd             " Show (partial) command in status line.
set showmatch           " Show matching brackets.
set ruler               " line and column number of the cursor position
set wildmenu            " enhanced command completion
set visualbell          " use visual bell instead of beeping
set laststatus=2        " always show the status line
set list listchars=tab:>-,trail:.,extends:>
set list

" highlight spell errors
hi SpellErrors guibg=red guifg=black ctermbg=red ctermfg=black

" terminal true colors
let $NVIM_TUI_ENABLE_TRUE_COLOR=1
let g:t_Co=256
let g:molokai_original=1

" decreasing updatetime
set updatetime=250

" making clipboard systemwide
"set clipboard=unnamed
set sessionoptions=buffers

" Colorschemes
colorscheme molokai
set colorcolumn=81
autocmd BufWritePre * :%s/\s\+$//e

" Setting the cursor to a vertical thin line in vim
if exists('$TMUX')
  let &t_SI = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=1\x7\<Esc>\\"
  let &t_SR = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=2\x7\<Esc>\\"
  let &t_EI = "\<Esc>Ptmux;\<Esc>\<Esc>]50;CursorShape=0\x7\<Esc>\\"
else
  let &t_SI = "\<Esc>]50;CursorShape=1\x7"
  let &t_SR = "\<Esc>]50;CursorShape=2\x7"
  let &t_EI = "\<Esc>]50;CursorShape=0\x7"
endif
:autocmd InsertEnter * set cul
:autocmd InsertLeave * set nocul
" upon hitting escape to change modes,
" send successive move-left and move-right
" commands to immediately redraw the cursor
inoremap <special> <Esc> <Esc>hl
" don't blink the cursor
set guicursor+=i:blinkwait0

" Erasing previously entered characters in insert mode
set backspace=indent,eol,start

" load bundles config
" -------------------
" NerdTree configuration
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif

" CtrlP Configuration
let g:ctrlp_clear_cache_on_exit = 1
let g:ctrlp_max_height = 40
let g:ctrlp_switch_buffer = 1
let g:ctrlp_user_command = ['.git', 'cd %s && git ls-files --exclude-standard -cod | grep -viE "\.(png|gif|jpg|gz|woff|eot|tiff|ttf|otf)$"']
let g:ctrlp_extensions = ['tag', 'buffertag', 'quickfix', 'mixed', 'line']
let g:ctrlp_custom_ignore = '\v[\/](node_modules|target|dist)|(\.(swp|ico|git|svn))$'

" Airline configuration
let g:airline_powerline_fonts = 1
set guifont=Inconsolata\ for\ Powerline\
let g:Powerline_symbols = 'fancy'
if has("gui_running")
   let s:uname = system("uname")
   if s:uname == "Darwin\n"
      set guifont=Inconsolata\ for\ Powerline:h15
   endif
endif
let g:Powerline_symbols = 'unicode'
let g:airline#extensions#tabline#enabled = 1
set noshowmode

" Syntastic
let g:syntastic_enable_signs=1
let g:syntastic_auto_loc_list=2
let g:syntastic_check_on_wq=0
let g:syntastic_error_symbol='✗'
let g:syntastic_warning_symbol='⚠'
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_check_on_open = 1
set statusline+=%#warningmsg#
set statusline+=%{SyntasticStatuslineFlag()}
set statusline+=%*
let g:syntastic_quiet_messages = { "level": "warnings" }

" Tagbar configuration
let g:tagbar_type_ruby = {
    \ 'kinds' : [
        \ 'm:modules',
        \ 'c:classes',
        \ 'd:describes',
        \ 'C:contexts',
        \ 'f:methods',
        \ 'F:singleton methods'
    \ ]
\ }
let g:tagbar_type_css = {
\ 'ctagstype' : 'Css',
    \ 'kinds'     : [
        \ 'c:classes',
        \ 's:selectors',
        \ 'i:identities'
    \ ]
\ }

" gitgutter
let g:gitgutter_realtime = 1
let g:gitgutter_eager = 0
let g:gitgutter_enabled = 1

" yankring
"let g:yankring_history_dir = '~/.config/nvim/backup'

" vim-indent-guides
let g:indent_guides_start_level = 2
let g:indent_guides_enable_on_vim_startup = 1
let g:indent_guides_guide_size = 1
let g:indent_guides_color_change_percent = 5

" snippets
let g:UltiSnipsEditSplit="vertical"


" greplace
set grepprg=git\ grep
let g:grep_cmd_opts = '--line-number'

" switch
let g:switch_mapping = "-"

" omni completion settings
set omnifunc=syntaxcomplete#Complete
autocmd FileType ruby,eruby let g:rubycomplete_buffer_loading = 1
autocmd FileType ruby,eruby let g:rubycomplete_classes_in_global = 1
autocmd FileType ruby,eruby let g:rubycomplete_rails = 1


" load key bindings
" -----------------"
" set mapleader
let mapleader = ","
let maplocalleader = "\\"

" disable search highlight
nmap <silent> <C-N> :silent noh<CR>

" ,e to fast finding files. just type beginning of a name and hit TAB
nmap <leader>e :e **/

" ,n to get the next location (compilation errors, grep etc)
nmap <leader>n :cn<CR>
nmap <leader>N :cp<CR>

" keep selection after in/outdent
vnoremap < <gv
vnoremap > >gv

" easier increment/decrement
nnoremap + <C-a>
nnoremap - <C-x>

" easy split navigation
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

" nerdtree
" Ctrl-P to Display the file browser tree
nmap <C-N> :NERDTreeTabsToggle<CR>
" ,p to show current file in the tree
nmap <leader>p :NERDTreeFind<CR>
" Nerd Tree option to see hidden files
let NERDTreeShowHidden=1

" yankring
"let g:yankring_replace_n_pkey = '<leader>['
"let g:yankring_replace_n_nkey = '<leader>]'
" ,y to show the yankring
"nmap <leader>y :YRShow<cr>

" ctrlp
" let g:ctrlp_map = '<leader>,'
let g:ctrlp_map = '<c-p>'
let g:ctrlp_cmd = 'CtrlP'

" fugitive
nmap <leader>g :silent Ggrep<space>
nmap <leader>D :Gdiff<space>

" tagbar
nmap <F8> :TagbarToggle<CR>

" eunuch
nmap <C-m> :Move
