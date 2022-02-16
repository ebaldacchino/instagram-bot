import * as puppeteer from 'puppeteer';
import type { Instagram } from './types';
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

const instagram: Instagram = {
	browser: null,
	page: null,
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
				await instagram.page.waitForSelector('article[role=presentation]');
				await delay(1000);
				const likeSelector = 'span [aria-label="like"]';
				let isLikeable = await post.$(likeSelector);
				if (isLikeable) await isLikeable.click();
				await delay(2000);
				const closeSelector = 'button [aria-label="Close"]';
				await instagram.page.click(closeSelector);
				await delay(1000);
			}
		}
	},
	likeFollowersProcess: async (targets = []) => {
		for (let target of targets) {
			await instagram.navigateToTargetPage(target);
			await instagram.openTargetFollowersModal(target);
			try {
				const followers = await instagram.page.$$(
					'div[aria-label="Followers"] li a[title]'
				);
				for (let follower of followers) {
					const isPrivate = await instagram.isFollowerPrivate(follower);
					if (isPrivate) continue;
					await instagram.likeFollowerImages(follower);
				}
			} catch (error) {
				console.log(error);
				console.log('Failed to iterate through followers');
			}
		}
	},
	isFollowerPrivate: async (follower): Promise<boolean> => {
		try {
			await follower.hover();
			const privateAccountLogo = instagram.page.$(
				'span [aria-label="Private account"]'
			);
			if (privateAccountLogo) return true;
		} catch (error) {
			console.log(error);
		} finally {
			return false;
		}
	},
	likeFollowerImages: async (follower) => {
		try {
			await follower.click();
			await instagram.wait(500);
			console.log('This is a public page');
			// iterate through images here
			const images = await instagram.page.$$('article a img');
			let indexes: number[] = [];
			while (indexes.length < 6 && images.length < indexes.length)
				indexes.push(getNewIndex(indexes, images));
				
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
			console.log("Error trying to like the follower's pics");
			console.log(err);
		} finally {
			await instagram.page.goBack();
		}
	},
	wait: async (ms = 300) => {
		try {
			await instagram.page.waitForNavigation({ waitUntil: 'networkidle2' });
			await delay(ms);
		} catch (error) {
			console.log(error);
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
	navigateToTargetPage: async (target) => {
		try {
			await instagram.page.type('input[aria-label="Search Input"]', target, {
				delay: randomizeDelay(50),
			});
			await delay(500);
			await instagram.page.click(`a[href="/${target}/`);
			await instagram.wait();
		} catch (error) {
			const url = BASE_URL + target;
			await instagram.page.goto(url, { waitUntil: 'networkidle2' });
		}
	},
	openTargetFollowersModal: async (target) => {
		try {
			await instagram.page.click(`a[href="/${target}/followers/"]`);
			await instagram.wait(500);
		} catch (error) {
			console.log('Failed to open followers modal');
			console.log(error);
		}
	},
};

export default instagram;
