const puppeteer = require('puppeteer');

module.exports = async () => {
	instagram.browser = await puppeteer.launch({
		headless: false,
	});
	instagram.page = await instagram.browser.newPage();
};
