import browser from './browser';
import login from './login';
import { getUrl } from './utils';
import config from './config';
import TargetsFollowers from './TargetsFollowers';

(async () => {
	try {
		const page = await browser.getPage();
		await login();

		//go to competitor's page
		const url = getUrl(`${config.target}/followers/`);
		await page.goto(url, {
			waitUntil: 'networkidle2',
		});

		let usernames = await TargetsFollowers.getUsernames();

		console.log(usernames);
	} catch (e) {
		console.log(e);
	} finally {
		browser.close();
	}
})();
