import browser from './browser';

export default async function getTargetsFollowers(): Promise<void> {
	const page = await browser.getPage();
	const scrollable_section = 'div[role=dialog] > div > div > div:nth-child(2)';

	await page.waitForSelector(scrollable_section);

	// scroll to bottom of followers container (so all followers are displayed in the UI)
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
}
