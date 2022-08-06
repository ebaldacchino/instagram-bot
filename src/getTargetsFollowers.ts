import browser from './browser';

export default async function getTargetsFollowers(): Promise<string[]> {
	const page = await browser.getPage();
	const scrollable_section = 'div[role=dialog] > div > div > div:nth-child(2)';

	await page.waitForSelector(scrollable_section);

	await page.evaluate(function scrollToBottom(selector) {
		const scrollableSection = document.querySelector(selector);

		scrollableSection.scrollTo({
			top: scrollableSection.scrollHeight - scrollableSection.clientHeight,
		});

		setTimeout(() => {
			const containerHeight = Math.ceil(
				scrollableSection.clientHeight + scrollableSection.scrollTop
			);

			if (scrollableSection.scrollHeight >= containerHeight) {
				scrollToBottom(selector);
			}
		}, 4000);
	}, scrollable_section);

	// get data
	const usernames = await page.evaluate((selector) => {
		let arr: string[] = [];

		for (let item of document.querySelectorAll(selector)) {
			const username: string =
				item.getAttribute('href') ?? ''.split('/').at(-2);
			if (username) {
				arr.push(username);
			}
		}
		return arr;
	}, 'div[role=dialog] li a');

	return usernames;
}
