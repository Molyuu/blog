# Molyuu's Blog

[blog.molyuu.com](https://blog.molyuu.com), built with [Astro](https://astro.build) and deployed on Netlify.

| Command           | Action                                   |
| :---------------- | :--------------------------------------- |
| `npm install`     | Install dependencies                     |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the site into `./dist/`            |
| `npm run preview` | Preview the build locally                |

## 写文章

```bash
scripts/new.sh                # 逐项询问，slug 必填，其余回车跳过
scripts/new.sh Hello-World    # 只给 slug，再询问其余各项
scripts/new.sh Hello-World -t 标题   # 不询问，直接生成
```

会生成 `src/content/blog/<slug>/index.md` 并填好下面的 frontmatter，`pubDate` 取当前时间。标题没填就用 slug。也可以手动新建（要用组件就写 `.mdx`）。网址是文件夹名转成小写，如 `Hello-World` → `/blog/hello-world/`；slug 只能用字母、数字、`-` 和 `_`，脚本会去掉其他字符。图片放在同一个文件夹里，用 `./xxx.png` 引用。

```markdown
---
title: "标题"
pubDate: "2026-11-25T20:00:00+08:00"
---

正文
```

- 必填：`title`、`pubDate`；字段不对会构建失败（见 `src/content.config.ts`）。
- 可选：`updatedDate`、`heroImage`（如 `./cover.png`）。
- 没有分类和标签，文章只按时间列出。

## 最近在做什么

`scripts/new.sh --now` 新建当月的 `src/content/now/YYYY-MM.md`，内容只写一个 Markdown 列表。首页显示最新的一篇，`/now/` 列出全部。

## 发布

本地预览用 `astro dev --background`（`astro dev stop` 停止），确认后推送到 `astro` 分支，Netlify 会自动部署。
