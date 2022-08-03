import browser from './browser';
import { getUrl } from './utils';
import config from './config';

export default async function login() {
	const page = await browser.getPage();
	await page.goto(getUrl(), { waitUntil: 'networkidle0' });

	//login to instagram
	const { username, password } = config.auth;
	await page.type('input[name=username]', username, { delay: 200 });
	await page.type('input[name=password]', password, { delay: 200 });
	await page.click('button[type=submit]', { delay: 200 });
	await page.waitForNetworkIdle();
	await page.click('button', { delay: 200 });
	await page.waitForNetworkIdle();
}
