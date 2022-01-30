const ig = require('./instagram');
require('dotenv').config();

(async () => {
	await ig.initialize();

	await ig.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

	await ig.likeTagsProcss(['test']);
	debugger;
})();
