const ProjectRepository = require('./projectRepository');
const { validateProjectCreationRequest } = require('./projectDto');
const UserService = require('../user/userService');
const CharityService = require('../charity/charityService');
const { sendProjectCreationEmail } = require('../../utils/sendMail');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your actual secret key

class ProjectService {
}

module.exports = new ProjectService();
