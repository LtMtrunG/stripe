const authRouter = require("../module/auth/authRouter");
const charityRouter = require("../module/charity/charityRouter");
const donorRouter = require("../module/donor/donorRouter");
const donationRouter = require("../module/donation/donationRouter");
const webHookRouter = require("../module/webhook/webHookRouter");

module.exports = {
    authRouter,
    charityRouter,
    donorRouter,
    donationRouter,
    webHookRouter,
};