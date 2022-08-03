import browser from './browser';
import login from './login';
import { getUrl } from './utils';
import config from './config';

(async () => {
	try {
		const page = await browser.getPage();
		await login();

		//go to competitor's page
		const url = getUrl(`${config.target}/followers/`);
		await page.goto(url, {
			waitUntil: 'networkidle0',
		});
	} catch (e) {
		console.log(e);
		browser.close();
	}
})();
