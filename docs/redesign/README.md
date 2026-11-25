# 博客改版：方向 A「纯文本手工站」

> **状态：已完成。** 2026-11-25 合并到 `astro` 并上线（提交 `d3a80c1`）。下面是当时的交接说明，保留作记录；现在以代码为准。实现时和设计稿不一样的地方，见文末「实际实现与设计稿的差异」。

这是改版的交接说明。设计稿是同目录下的两个静态 HTML：

- `home.html` —— 首页
- `post.html` —— 文章页

直接用浏览器打开就能看。里面的文章标题、正文和「最近在做什么」都是**示意内容**，只用来定版式；邮箱 `[你的邮箱]` 是占位。实现时以这两个文件里的数值（颜色、字号、行高、间距）为准。

## 设计要点

- 气质：不 fancy，像手写的个人主页。没有阴影、渐变、圆角卡片、hero 大图。
- 布局：内容列在页面中**居中**（2026-11-25 改，原稿是靠左）；站名、导航、标题、元信息行、页脚居中；文章正文和列表行仍左对齐，列表整体居中。最大宽度约 660px；左右内边距 `clamp(20px, 7vw, 96px)`。
- 颜色：
  - 底色 `#fbfbf7`
  - 正文 `#1c1c1a`
  - 次要文字 `#66665f`
  - 链接 `#1d3fa8`，hover `#0d2470`，保留下划线（`text-underline-offset: 3px`）
  - 分隔线 `1px dashed #b8b8ae`
  - 行内代码底色 `#eeeee6`；代码块底色 `#f0f0e8`，边框 `1px solid #dcdcd2`
  - 引用：左侧 `2px solid #c9c9bf`，文字 `#4a4a44`
- 字体：
  - 正文用宋体 `'Songti SC', 'Noto Serif SC', 'SimSun', serif`，17px，行高约 1.85–1.9
  - 日期、元信息、提示符、代码用等宽字体 IBM Plex Mono，13–15px
  - 建议中文**不加载 webfont**，直接用系统宋体
  - IBM Plex Mono 用 Astro 的 `fontProviders.google()` 自托管，替换掉现在的 Atkinson
- 标题：h1 28px/700；文章内 h2 20px/700；首页的区块标题 17px/700。

## 首页结构（`src/pages/index.astro`）

1. 提示符行 `~/molyuu $ cat index.txt`（等宽、灰色）
2. h1 站名 + 一句话简介
3. 导航：`文章 / 分类 / 关于 / RSS`，斜杠是灰色分隔符（`aria-hidden`）
4. 虚线 `hr`
5. 「最近在做什么（YYYY 年 M 月）」：一个短列表。2026-11-25 改成按月记录：每次更新在 `src/content/now/` 下新建 `YYYY-MM.md`，首页只显示最新一份，下面链到 `/now/` 看全部历史
6. 「全部文章」：按年份分组，组标题写成 `## 2026`（等宽、灰色）；每行是 `MM-DD` + 标题链接 + `[分类]`
7. 虚线 `hr`，页脚

## 文章页结构（`src/layouts/BlogPost.astro`）

1. 返回链接 `← 站名`
2. h1 标题 + 等宽元信息行：`YYYY-MM-DD · [分类] · 约 N 字`，有 `updatedDate` 时再加更新时间。字数在构建时按正文计算
3. 虚线 `hr`，正文，虚线 `hr`
4. 上一篇 / 下一篇：在 `src/pages/blog/[...slug].astro` 的 `getStaticPaths` 里算出相邻文章，作为 props 传进来
5. 一行「读完有想法？写信给我：邮箱」
6. 去掉 hero 图片和居中标题

## 其他要改的文件

- `src/styles/global.css`：按上面的值重写变量和基础样式（`body`、`a`、`hr`、`code`、`pre`、`blockquote`、`img`），去掉渐变背景、`--box-shadow` 和圆角
- `src/components/Header.astro`：换成首页顶部那一块（提示符 + 站名 + 文字导航）。文章页只需要一个简化版，或者干脆不要 Header，只留返回链接
- `src/components/Footer.astro`：左对齐、灰色小字。保留 `© 年份 Molyuu · CC BY-NC-SA 4.0`，加一行 `最后修改 YYYY-MM-DD`（取构建日期）；去掉渐变背景，GitHub 改成文字链接
- `src/pages/blog/index.astro`：卡片网格不要了。可以改成和首页一样的列表，或者重定向到 `/`
- 新建 `src/pages/category/[cat].astro`：与首页列表相同，按分类筛选

## 分类方案（已确定）

原来 `category` 只有 `note` 和 `essay`，`tags` 里是 `tech`、`oi`、`life` 等。设计稿用的分类是 **技术 / 哲学 / 社会 / 影评 / 随笔**。

2026-11-25 Molyuu 确认按下面的方案做，已经实现：

- `category` 改成必填的 enum：`tech | philosophy | society | film | essay`（`src/consts.ts` 的 `CATEGORY_IDS`）
- 页面上通过 `CATEGORY_LABELS` 映射表显示中文名
- `tags` 保留，作细分标签
- 旧文章归类：Neovim、CSP-J/S 笔记 → tech；CSP-S 2023 游记、Hello Internet、Molyuu Disorder → essay
- 只有有文章的分类才生成 `/category/<id>/` 页面

## 约束

- 不要动 `netlify.toml` 里的旧 Hexo 重定向
- 文章路径保持 `/blog/<slug>/` 不变
- 在新分支上改，用 Netlify 的 deploy preview 确认后再合并（这次按 Molyuu 的要求没走 deploy preview，在本地看过后直接合并到 `astro`）
- 手机宽度下也要好用：列表行用 `flex-wrap`，`pre` 横向滚动

## 实际实现与设计稿的差异

- 布局居中，原稿是靠左（见上面「设计要点」）。页脚也居中，不是「其他要改的文件」里写的左对齐
- 站名和简介沿用原来的 `Molyuu's Blog` 和「写一些公开性的长文章和教程的地方」，没用设计稿里的示意文字
- 联系邮箱是 `i@molyuu.com`（`src/consts.ts` 的 `SITE_EMAIL`）
- 「最近在做什么」改成按月记录：`src/content/now/YYYY-MM.md`，首页显示最新一份，`/now/` 显示全部
- 代码块关掉了语法高亮（`astro.config.mjs` 里 `markdown.syntaxHighlight: false`），和设计稿一样是单色
- 多了 `/category/` 分类总览页，导航里的「分类」指向它；`/blog/` 保留为和首页一样的完整列表
- 文章页底部除了上一篇 / 下一篇和写信那一行，也有版权和「最后修改」两行
- 日期一律按 Asia/Shanghai 格式化，避免 Netlify 用 UTC 构建时日期错一天；字数不算代码块
