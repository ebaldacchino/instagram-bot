const initialize = require('./initialize');
const login = require('./login');
const navigateToProfile = require('./navigateToProfile');
const likeTagsProcess = require('./likeTagsProcess');
const likeFollowersProcess = require('./likeFollowersProcess');

export const BASE_URL = 'https://www.instagram.com/';
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}`;
const PROFILE_URL = (username) =>
	`https://www.instagram.com/${username}/followers/`;

export const delay = (ms) =>
	new Promise((resolve) => setTimeout(resolve, randomizeDelay(ms)));
const randomizeDelay = (ms) => ms + Math.random() * ms;

const instagram = {
	browser: null,
	page: null,
	initialize,
	login,
	navigateToProfile,
	likeTagsProcess,
	likeFollowersProcess,
};

module.exports = instagram;
