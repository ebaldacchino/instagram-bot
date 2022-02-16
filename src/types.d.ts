import type { Browser, ElementHandle, Page } from 'puppeteer';

export interface Instagram {
	browser: Browser | null;
	page: Page | null;
	initialize: () => Promise<void>;
	login: (username: string, password: string) => Promise<void>;
	likeFollowersProcess: (followers?: string[]) => Promise<void>;
	likeFollowerImages: (follower: ElementHandle<Element>) => Promise<void>;
	isFollowerPrivate: (follower: ElementHandle<Element>) => Promise<boolean>;
	navigateToProfile: () => Promise<void>;
	navigateToTargetPage: (target: string) => Promise<void>;
	likeTagsProcess: (tags?: any[]) => Promise<void>;
	openTargetFollowersModal: (target: string) => Promise<void>;
	wait: (ms?: number) => Promise<void>;
}
