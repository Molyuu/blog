import { type CollectionEntry, getCollection } from 'astro:content';

export type NowEntry = CollectionEntry<'now'>;

/** Non-empty entries from src/content/now/, newest first. */
export async function getNowEntries(): Promise<NowEntry[]> {
	const entries = await getCollection('now', (entry) => Boolean(entry.body?.trim()));
	return entries.sort((a, b) => b.id.localeCompare(a.id));
}

/** `2026-11` → `2026 年 11 月`. The entry id comes from its file name. */
export function nowLabel(id: string): string {
	const match = /^(\d{4})-(\d{2})$/.exec(id);
	if (!match) throw new Error(`src/content/now/${id}.md: 文件名应为 YYYY-MM.md`);
	return `${match[1]} 年 ${Number(match[2])} 月`;
}
