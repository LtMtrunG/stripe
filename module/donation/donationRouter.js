const express = require('express');
const DonationController = require('./donationController');
const { authenticate, authorize } = require("../../middleware/auth");
const UserType = require('../user/enum/userType');
const DonationRouter = express.Router();

DonationRouter.post(
    '/donate',
    authenticate,
    authorize([UserType.DONOR]),
    DonationController.donate
);

DonationRouter.get(
    '/all', 
    authenticate,
    authorize([UserType.ADMIN]),
    DonationController.getAllDonations
);

DonationRouter.get(
    '/my', 
    authenticate,
    authorize([UserType.DONOR]),
    DonationController.getMyDonations
);


module.exports = DonationRouter;