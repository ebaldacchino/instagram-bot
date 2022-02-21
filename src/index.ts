import ig from './instagram';
import { config } from 'dotenv';
config();

(async () => {
	await ig.initialize();
	await ig.goToLoginPage();
	await ig.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
	await ig.navigateToProfile();
	// await ig.likeFollowersProcess(JSON.parse(process.env.FOLLOWERS));
	await ig.likeTagsProcess(JSON.parse(process.env.TAGS));
	debugger;
})();
