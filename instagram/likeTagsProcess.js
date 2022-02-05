const { delay } = require(".");

module.exports = async (tags = []) => {
	await delay(2000);
	for (let tag of tags) {
		/* go to the tag page */
		await instagram.page.goto(TAG_URL(tag), {
			waitUntil: 'networkidle2',
		});
		await delay(1000);
		const posts = await instagram.page.$$(
			'main > article > div:nth-of-type(2) img'
		);

		for (let i = 0; i < posts.length; i++) {
			let post = posts[i];
			/* Click on the post */
			await post.click();
			/* Wait for the modal to appear */
			await instagram.page.WaitForSelector('article[role=presentation]');
			await delay(1000);
			const likeSelector = 'span [aria-label="like"]';
			let isLikeable = await post.$(likeSelector);
			if (isLikeable) await post.click(likeSelector);
			await delay(2000);
			const closeSelector = 'button [aria-label="Close"]';
			await instagram.page.click(closeSelector);
			await delay(1000);
		}
	}
};
