const express = require('express');
const DonorController = require('./donorController');
const { authenticate, authorize } = require("../../middleware/auth");
const UserType = require('../user/enum/userType');
const DonorRouter = express.Router();

DonorRouter.get(
    '/project/:id',
    authenticate,
    authorize([UserType.DONOR]),
    DonorController.getDonatedProjects
);

module.exports = DonorRouter;