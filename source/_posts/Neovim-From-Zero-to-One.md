---
title: 'Neovim: From Zero to One'
date: 2023-08-21 16:31:19
tags:
    - linux
    - tech
    - neovim
categories: note
---

从零开始的 Neovim 配置指南

<!--more-->

一直以来我都同时使用两个编辑器——写代码时使用 VSCode 作为 IDE, 而进行一些配置文件的修改或者对于代码的小修小改时, 我会选择 Neovim. (~~世界名画: 在 VSCode 的终端中使用 Neovim~~) 但是在网上似乎很少看到把 Neovim 当普通编辑器用, 更多是装上了各种 LSP 和自动补全的插件的 IDE. 于是记录一下自己的 Neovim 配置, 也希望有类似需求的人可以参考.

![You will get an editor like this...](./demo.png "demo")

## Overview

### Requirements

- 安装了最新版本的 `Neovim`
- 懂一点 `Lua` 的基本语法. Neovim 的配置文件完全是由 Lua 写的, 对 Lua 的基本语法有了解可以起到很好的帮助.

### Configuration Files Structure

```bash
$HOME/.config/nvim
├── init.lua
└── lua
    ├── colorscheme.lua 
    ├── keymaps.lua
    ├── options.lua
    └── plugins.lua
```
- `init.lua`: 配置文件的入口. 我们会在这里启动其他的配置文件.
- ~~剩下几个应该不用解释了吧, 看名字就知道了~~

## Configure

让我们开始吧!

### Preparation

Neovim 的配置文件一开始并不存在, 需要我们手动去创建.

```bash
$ mkdir ~/.config/nvim
$ mkdir ~/.config/nvim/lua
$ touch ~/.config/nvim/init.lua
```
### Options

`options.lua` 控制了一些全局启用的选项. 这里我们将:
- 启用系统的剪贴板
- 启用鼠标
- 用真正的 Tab 来替代输入 Tab 时的空格
- UI 调整
- 更人性化的搜索

我们现在可以创建 `~/.config/nvim/lua/options.lua` 然后编辑:

```lua
vim.opt.clipboard = 'unnamedplus'   -- 使用系统剪贴板
vim.opt.mouse = 'a'                 -- 启用鼠标

-- Tab
vim.opt.tabstop = 4
vim.opt.softtabstop = 4          
vim.opt.shiftwidth = 4          

-- UI config
vim.opt.number = true               -- 显示当前行的绝对行号 
vim.opt.relativenumber = true       -- 显示相对行号
vim.opt.cursorline = true           -- 高亮当前行

-- Searching
vim.opt.incsearch = true
vim.opt.hlsearch = false            -- 禁用高亮
vim.opt.ignorecase = true           -- 默认大小写不敏感
vim.opt.smartcase = true            -- 输入大写字母时, 大小写敏感
```

接着编辑 `init.lua`, 导入 `lua/options.lua`

```lua
require(options)
```
### Key Mappings

键位是非常影响编辑器使用体验的一个部分.

现在我们创建 `~/.config/nvim/lua/keymaps.lua` 并编辑:

```lua
-----------------
-- Normal mode --
-----------------

-- Ctrl+Q 退出(我用的是 :qa!, 在退出时若有待保存的数据也会直接退出, 所以记得保存), Ctrl+S 保存
vim.keymap.set('n', '<C-q>', ':qa!<ENTER>', opts)
vim.keymap.set('n', '<C-s>', ':w<ENTER>', opts)

-- Ctrl+N 打开侧面的文件管理器(好像不能这么叫 不过我也不知道该怎么叫)
-- 需要注意的是想关闭这玩意需要在那个文件管理器的窗口中输入 q
vim.keymap.set('n', '<C-n>', ':Neotree<ENTER>', opts)

-----------------
-- Visual mode --
-----------------

-- 你可以写点自己的配置

-----------------
-- Insert mode --
-----------------

-- 和上面的是一样的, 这里是为了能在 Insert 模式下也有效果写的
vim.keymap.set('i', '<C-q>', '<ESC>:qa!<ENTER>', opts)
vim.keymap.set('i', '<C-s>', '<ESC>:w<ENTER>', opts)

vim.keymap.set('i', '<C-n>', '<ESC>:Neotree<ENTER>', opts)
```

继续编辑 `init.lua`

```lua
require('keymaps')
```

### Plugins

Neovim 有丰富的插件生态. 首先, 我们需要一个包管理器. 在这里我使用了 [packer](https://github.com/wbthomason/packer.nvim), 这有非常多很酷的 features:

- 支持依赖管理
- 支持延迟加载
- 支持安装/更新钩子
- ...

首先, 我们要安装 packer

> GNU/Linux

```bash
git clone --depth 1 https://github.com/wbthomason/packer.nvim ~/.local/share/nvim/site/pack/packer/start/packer.nvim
```

如果你是 Arch Linux 用户, 更推荐使用 AUR 中的 `nvim-packer-git` 包

> Windows

```pwsh
git clone https://github.com/wbthomason/packer.nvim "$env:LOCALAPPDATA\nvim-data\site\pack\packer\start\packer.nvim"
```

剩下的后面有空再写吧阿巴阿巴阿巴
