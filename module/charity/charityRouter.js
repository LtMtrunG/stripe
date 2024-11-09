const express = require('express');
const CharityController = require('./charityController');
const { authenticate, authorize } = require("../../middleware/auth");
const UserType = require('../user/enum/userType');
const CharityRouter = express.Router();

CharityRouter.post(
    '/update-card',
    authenticate,
    authorize([UserType.CHARITY]),
    CharityController.updateCard
);

module.exports = CharityRouter;