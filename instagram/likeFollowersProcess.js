const { delay } = require('.');

const navigateToFollowerPage = (follower) => {
	await instagram.page.type('input[aria-label="Search Input"]', follower, {
		delay: randomizeDelay(50),
	});
	await delay(1000);
	await instagram.page.click(`a[href="/${follower}/`);
	await instagram.page.waitForNavigation({
		waitUntil: 'networkidle2',
	});
};

module.exports = async (followers = []) => {
	await delay(2000);

	for (let follower of followers) {
		navigateToFollowerPage(follower);
	}
};
