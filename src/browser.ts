import { Browser as PuppeteerBrowser, Page } from 'puppeteer';
const puppeteer = require('puppeteer');

export const initializeBrowser = (): PuppeteerBrowser =>
	puppeteer.launch({
		headless: false,
		args: ['--lang=en-US,en'],
		devtools: true,
	});

class Browser {
	private static instance: Browser;
	private _browser: PuppeteerBrowser;
	private _page: Page;

	private constructor() {}

	public static getInstance(): Browser {
		Browser.instance ??= new Browser();
		return Browser.instance;
	}

	public async getPage() {
		if (!this._browser) {
			this._browser = await puppeteer.launch({
				headless: false,
				args: ['--lang=en-US,en'],
			});
			this._page = await this._browser.newPage();
		}
		return this._page;
	}

	public async close(): Promise<void> {
		if (this._browser) {
			await this._browser.close();
			this._browser = null;
			this._page &&= null;
		}
	}
}

const browser: Browser = Browser.getInstance();

export default browser;
