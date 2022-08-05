import browser from './browser';
import login from './login';
import { getUrl } from './utils';
import config from './config';
import getTargetsFollowers from './getTargetsFollowers';

(async () => {
	try {
		const page = await browser.getPage();
		await login();

		//go to competitor's page
		const url = getUrl(`${config.target}/followers/`);
		await page.goto(url, {
			waitUntil: 'networkidle0',
		});

		await getTargetsFollowers();
	} catch (e) {
		console.log(e);
		browser.close();
	}
})();
