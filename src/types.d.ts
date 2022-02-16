import type { Browser, Page } from 'puppeteer';
export interface Instagram {
	browser: Browser | null;
	page: Page | null;
	initialize: () => Promise<void>;
	wait: (ms?: number) => Promise<void>;
	login: (username: string, password: string) => Promise<void>;
	navigateToProfile: () => Promise<void>;
	navigateToFollowersPage: (follower: string) => Promise<void>;
	likeTagsProcess: (tags?: any[]) => Promise<void>;
	openFollowersModal: (follower: string) => Promise<void>;
	likeFollowersProcess: (followers?: string[]) => Promise<void>;
}
