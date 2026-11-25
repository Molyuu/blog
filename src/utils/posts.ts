import { type CollectionEntry, getCollection } from 'astro:content';
import { isoDate } from './date';

export type Post = CollectionEntry<'blog'>;
export type Neighbor = { id: string; title: string };

/** All posts, newest first. */
export async function getPosts(): Promise<Post[]> {
	return (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}

/** Groups posts (already sorted newest first) by publication year. */
export function groupByYear(posts: Post[]): [year: string, posts: Post[]][] {
	const groups = new Map<string, Post[]>();
	for (const post of posts) {
		const year = isoDate(post.data.pubDate).slice(0, 4);
		groups.set(year, [...(groups.get(year) ?? []), post]);
	}
	return [...groups];
}

const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;

/**
 * Rough reading length of a Markdown body: one per CJK character plus one per
 * Latin word. Code blocks, URLs and markup are not counted.
 */
export function countWords(markdown: string): number {
	const text = markdown
		.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, '')
		.replace(/https?:\/\/\S+/g, '');
	const cjk = text.match(CJK)?.length ?? 0;
	const words = text.replace(CJK, ' ').match(/[\p{L}\p{N}]+(?:['’.-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
	return cjk + words;
}

/** Rounds a word count for the「约 N 字」label. */
export function roundWords(n: number): number {
	if (n < 100) return n;
	if (n < 1000) return Math.round(n / 10) * 10;
	return Math.round(n / 100) * 100;
}
