#!/usr/bin/env bash
# Scaffold content. pubDate is always the current local time.
#   scripts/new.sh                                     → 逐项询问（slug 必填，其余可留空）
#   scripts/new.sh <slug>                              → 用这个 slug，再询问其余各项
#   scripts/new.sh <slug> -t 标题                     → 不询问，直接生成
#   scripts/new.sh --now                               → src/content/now/YYYY-MM.md
set -euo pipefail
cd "$(dirname "$0")/.."

usage() { echo '用法：scripts/new.sh [<slug> [-t 标题]] | --now' >&2; exit 1; }
fail() { echo "$1" >&2; exit 1; }

# Keep only characters that survive into the URL; Astro drops the rest anyway (Hello-World! → hello-world).
clean_slug() {
	local s
	s=$(printf '%s' "$1" | LC_ALL=C tr -cd 'A-Za-z0-9_-')
	[ -n "$s" ] || { echo "slug 至少要有一个字母、数字、- 或 _" >&2; return 1; }
	[ "$s" = "$1" ] || echo "slug 里只能用字母、数字、- 和 _，已改成：$s" >&2
	[ ! -e "src/content/blog/$s" ] || { echo "已存在：src/content/blog/$s" >&2; return 1; }
	slug=$s
}

# Escape for a double-quoted YAML/JSON string.
q() { local s=${1//\\/\\\\}; printf '"%s"' "${s//\"/\\\"}"; }

ask_rest() {
	read -r -e -p "标题 [$(printf '%s' "$slug" | tr '_-' '  ')]: " title
}

slug="" title="" now=0

if [ $# -eq 0 ]; then
	echo "新建文章（直接回车表示使用默认值）"
	while :; do
		read -r -e -p "slug（必填，也是网址）: " input
		[ -n "$input" ] || { echo "slug 不能为空" >&2; continue; }
		clean_slug "$input" && break
	done
	ask_rest
elif [ $# -eq 1 ] && [[ "$1" != -* ]]; then
	clean_slug "$1" || exit 1
	echo "新建文章 ${slug}（直接回车表示使用默认值）"
	ask_rest
else
	while [ $# -gt 0 ]; do
		case "$1" in
			-t|--title)       [ $# -ge 2 ] || usage; title="$2"; shift 2 ;;
			-n|--now)         now=1; shift ;;
			-*)               usage ;;
			*)                [ -z "$slug" ] || usage; slug="$1"; shift ;;
		esac
	done

	if [ "$now" = 1 ]; then
		file="src/content/now/$(date +%Y-%m).md"
		[ ! -e "$file" ] || fail "已存在：$file"
		mkdir -p "$(dirname "$file")"
		printf -- '- \n' > "$file"
		echo "已创建：$file"
		exit
	fi

	[ -n "$slug" ] || usage
	clean_slug "$slug" || exit 1
fi

[ -n "$title" ] || title=$(printf '%s' "$slug" | tr '_-' '  ')

tz=$(date +%z)
file="src/content/blog/$slug/index.md"
mkdir -p "$(dirname "$file")"
cat > "$file" <<EOF
---
title: $(q "$title")
pubDate: "$(date +%Y-%m-%dT%H:%M:%S)${tz:0:3}:${tz:3:2}"
---

EOF
echo "已创建：$file"
