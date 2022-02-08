import * as puppeteer from 'puppeteer';

const BASE_URL = 'https://www.instagram.com/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}`;
const PROFILE_URL = (username) =>
	`https://www.instagram.com/${username}/followers/`;

const delay = (ms) =>
	new Promise((resolve) => setTimeout(resolve, randomizeDelay(ms)));
const randomizeDelay = (ms) => ms + Math.random() * ms;

const getNewIndex = (indexes: number[], images: any[]): number | null => {
	let result = null;
	while (result == null) {
		const newIndex = Math.floor(Math.random() * images.length);
		if (indexes.indexOf(newIndex) === -1) {
			result = newIndex;
		}
	}
	return result;
};

const instagram = {
	browser: null,
	page: null,
	wait: async (ms = 300) => {
		try {
			await instagram.page.waitForNavigation({ waitUntil: 'networkidle2' });
			await delay(ms);
		} catch (error) {
			console.log(error);
		}
	},
	initialize: async () => {
		instagram.browser = await puppeteer.launch({
			headless: false,
		});
		instagram.page = await instagram.browser.newPage();
	},
	login: async (username, password) => {
		await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
		await delay(300);
		try {
			let buttonToLoginPage = await instagram.page.$(
				'//a[contains(text(), "Log in")]'
			);
			if (buttonToLoginPage) {
				await buttonToLoginPage.click();
				await instagram.wait(300);
			}
		} catch (err) {
			console.log('Already on login page');
		}

		try {
			await instagram.page.type('input[name=username]', username, {
				delay: randomizeDelay(50),
			});
			await delay(500);
			await instagram.page.type('input[name=password]', password, {
				delay: randomizeDelay(50),
			});
			await delay(500);
			await instagram.page.click('button[type=submit]');
			await instagram.wait(300);
		} catch (err) {
			console.log(err);
		}
	},
	navigateToProfile: async () => {
		try {
			await delay(500);
			await instagram.page.click('nav span[role="link"]');
			await delay(500);
			await instagram.page.click('svg[aria-label="Profile"]');
			await instagram.wait(300);
		} catch (err) {
			console.log(err);
		}
	},
	//likeTagsProcess,
	navigateToFollowersPage: async (follower) => {
		try {
			await instagram.page.type('input[aria-label="Search Input"]', follower, {
				delay: randomizeDelay(50),
			});
			await delay(500);
			await instagram.page.click(`a[href="/${follower}/`);
			await instagram.wait();
		} catch (error) {
			const url = BASE_URL + follower;
			await instagram.page.goto(url, { waitUntil: 'networkidle2' });
		}
	},
	openFollowersModal: async (follower) => {
		try {
			await instagram.page.click(`a[href="/${follower}/followers/"]`);
			await instagram.wait(500);
		} catch (error) {
			console.log('Failed to open followers modal');
			console.log(error);
		}
	},
	likeTagsProcess: async (tags = []) => {
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
	},
	likeFollowersProcess: async (followers = []) => {
		for (let follower of followers) {
			await instagram.navigateToFollowersPage(follower);
			await instagram.openFollowersModal(follower);
			try {
				const followers = await instagram.page.$$(
					'div[aria-label="Followers"] li a[title]'
				);
				for (let i = 0; i < followers.length; i++) {
					await followers[i].click();
					// await followers[i].click({ button: 'middle' });
					await instagram.wait(500);
					// change window
					try {
						const followersButton = await instagram.page.$(
							`a[href="/${follower}/followers/"]`
						);
						if (!followersButton) throw new Error();

						console.log('This is a public page');
						// iterate through images here
						const images = await instagram.page.$$('article a img');
						let indexes = [];
						while (indexes.length < 6)
							indexes.push(getNewIndex(indexes, images));
						console.log(indexes);
						for (let i of indexes) {
							// opens image modal
							await images[i].click();
							try {
								await instagram.wait(1000);
								const likeButton = await instagram.page.$(
									`svg[aria-label="Like"][fill="#262626"]`
								);
								if (likeButton) await likeButton.click();
							} catch (error) {
								console.log('Already liked');
								indexes.push(getNewIndex(indexes, images));
							} finally {
								await delay(1000);
								// close image modal
								await instagram.page.click('svg[aria-label="Close"]');
								await instagram.wait(1000);
							}
						}
					} catch (err) {
						console.log('This is a private page');
					} finally {
						// exit window
						//await instagram.browser.close();
					}
				}
			} catch (error) {
				console.log(error);
				console.log('Failed to iterate through followers');
			}
		}
	},
};

export default instagram;
