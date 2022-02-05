const { delay } = require(".");

module.exports = async () => {
	try {
		await delay(2000);
		await instagram.page.click('nav span[role="link"]');
		await delay(1000);
		await instagram.page.click('svg[aria-label="Profile"]');
		await instagram.page.waitForNavigation({
			waitUntil: 'networkidle2',
		});
	} catch (err) {
		console.log(err);
	}
};
