import * as dotenv from 'dotenv';

dotenv.config();

const config = {
	auth: {
		username: process.env.USER ?? '',
		password: process.env.PASSWORD ?? '',
	},
	target: process.env.TARGET_USERNAME,
};

export default config;
