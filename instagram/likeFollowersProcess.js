const instagram = require('.');
const { delay } = require('.');

const navigateToFollowerPage = async (follower) => {
	await instagram.page.type('input[aria-label="Search Input"]', follower, {
		delay: randomizeDelay(50),
	});
	await delay(1000);
	await instagram.page.click(`a[href="/${follower}/`);
	await instagram.page.waitForNavigation({
		waitUntil: 'networkidle2',
	});
};

const openFollowersModal = async (follower) => {
	await instagram.page.click(`a[href="/${follower}/followers/"]`);
	await instagram.page.waitForNavigation({
		waitUntil: 'networkidle2',
	});
	await delay(2000);
};

const iterateThroughfollowers = () => {
	const followers = await instagram.page.$$(
		'div[aria-label="Followers"] li a[title]'
	);

	for (let i=0; i < followers.length; i++) {
		const follower = followers[i];
		await instagram.page.click(follower, { button: 'middle' });
		// if not private page
			//	get number of images
			//	make array of six random numbers
			//	for each number in array
				//	click on that image
				//	if like button
					//	click like button
				//	else
					//	add another number to the array (that isn't already there)
				//	close image modal
		// close window regardless
	}
};

module.exports = async (followers = []) => {
	await delay(2000);

	for (let followersTarget of followersTargets) {
		await navigateToFollowerPage(followersTarget);
		await openFollowersModal(followersTarget);
		await iterateThroughfollowers();
	}
};
