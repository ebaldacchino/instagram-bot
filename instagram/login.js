const { delay, BASE_URL } = require(".");

module.exports = async (username, password) => {
	await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    
	try {
		let buttonToLoginPage = await instagram.page.$(
			'//a[contains(text(), "Log in")]'
		);
		if (buttonToLoginPage) {
			await delay(2000);
			await buttonToLoginPage.click();
			await instagram.page.waitForNavigation({ waitUntil: 'networkidle2' });
		}
	} catch (err) {
		console.log('Already on login page');
	}

	try {
		await delay(2000);
		await instagram.page.type('input[name=username]', username, {
			delay: randomizeDelay(50),
		});
		await delay(1000);
		await instagram.page.type('input[name=password]', password, {
			delay: randomizeDelay(50),
		});
		await delay(1000);
		await instagram.page.click('button[type=submit]');
		await instagram.page.waitForNavigation({
			waitUntil: 'networkidle2',
		});
	} catch (err) {
		console.log(err);
	}
};
