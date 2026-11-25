// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Molyuu's Blog";
export const SITE_DESCRIPTION = '写一些公开性的长文章和教程的地方';
export const SITE_EMAIL = 'i@molyuu.com';

export const CATEGORY_IDS = ['tech', 'philosophy', 'society', 'film', 'essay'] as const;
export type Category = (typeof CATEGORY_IDS)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
	tech: '技术',
	philosophy: '哲学',
	society: '社会',
	film: '影评',
	essay: '随笔',
};
