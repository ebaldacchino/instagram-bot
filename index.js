"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instagram_1 = require("./instagram");
const dotenv_1 = require("dotenv");
dotenv_1.config();
(async () => {
    await instagram_1.default.initialize();
    await instagram_1.default.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    await instagram_1.default.navigateToProfile();
    await instagram_1.default.likeFollowersProcess(JSON.parse(process.env.FOLLOWERS));
    //await ig.likeTagsProcess(JSON.parse(process.env.TAGS));
    debugger;
})();
