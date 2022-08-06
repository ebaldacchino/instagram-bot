import type { Page } from 'puppeteer';
import browser from './browser';

const scrollableSectionSelector =
	'div[role=dialog] > div > div > div:nth-child(2)';
const urlElementsSelector = 'div[role=dialog] span a[role=link]';

export default class TargetsFollowers {
	private static index = 0;
	private static hitBottomOfFollowersContainer = false;
	private static usernames: string[] = [];
	private static page: Page;

	private constructor() {}

	static async getUsernames() {
		this.page = await browser.getPage();
		await this.scrollToBottomOfFollowersContainer();
		await this.scrapeUsernames();
		return this.usernames;
	}

	private static async scrapeUsernames() {
		const urlElements = await this.page.$$(urlElementsSelector);
		for (let i = this.index; i < urlElements.length; i++) {
			const username = await this.page.evaluate((el) => {
				return el.getAttribute('href')?.split('/').at(-2);
			}, urlElements[i]);

			if (username) {
				this.usernames.push(username);
			}
		}
		this.index = urlElements.length;
	}

	private static async scrollToBottomOfFollowersContainer(): Promise<void> {
		await this.page.waitForSelector(scrollableSectionSelector);
		while (!this.hitBottomOfFollowersContainer) {
			await this.scrollDown();
			await this.page.waitForTimeout(4000);
			await this.checkBottomOfFollowersContainer();
		}
	}

	private static async scrollDown() {
		await this.page.evaluate((selector) => {
			const el = document.querySelector(selector);
			el.scrollTo({
				top: el.scrollHeight - el.clientHeight,
			});
		}, scrollableSectionSelector);
	}

	private static async checkBottomOfFollowersContainer() {
		const isBottom = await this.page.evaluate((selector) => {
			const el = document.querySelector(selector);
			const containerHeight = Math.ceil(el.clientHeight + el.scrollTop);
			return el.scrollHeight <= containerHeight;
		}, scrollableSectionSelector);

		if (isBottom) {
			this.hitBottomOfFollowersContainer = true;
		}
	}
}
