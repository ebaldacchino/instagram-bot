const puppeteer = require('puppeteer');

const BASE_URL = 'https://www.instagram.com/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}`;
const PROFILE_URL = (username) =>
	`https://www.instagram.com/${username}/followers/`;

const delay = (ms) =>
	new Promise((resolve) => setTimeout(resolve, randomizeDelay(ms)));
const randomizeDelay = (ms) => ms + Math.random() * ms;

const instagram = {
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

			await delay(2000);

			await instagram.page.WaitForSelector('nav span[role="link"]');

			await delay(1000);

			await instagram.page.click('//div[contains(text(), "Profile")]');
		} catch (err) {
			console.log(err);
		}

		likeTagsProcess = async (tags = []) => {
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
	},
};

module.exports = instagram;
