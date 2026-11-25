// Posts are written in UTC+8, but Netlify builds in UTC. Always format in Shanghai time,
// otherwise a post published at 02:58 +08:00 shows up on the previous day.
const parts = new Intl.DateTimeFormat('en-US', {
	timeZone: 'Asia/Shanghai',
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
});

/** `YYYY-MM-DD` in Asia/Shanghai. */
export function isoDate(date: Date): string {
	const get = (type: Intl.DateTimeFormatPartTypes) =>
		parts.formatToParts(date).find((p) => p.type === type)!.value;
	return `${get('year')}-${get('month')}-${get('day')}`;
}
