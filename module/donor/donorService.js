const DonorRepository = require('./donorRepository');
const UserRepository = require('../user/userRepository');
const { validateDonorRegisterRequest } = require('./donorDto');
const projectRepository = require('../project/projectRepository');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your actual secret key

class DonorService {

  async createDonor(data, id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isVerified) {
      throw new Error('This User has NOT verified the email for register!');
    }

    const { error } = validateDonorRegisterRequest(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Create the Stripe customer
    let stripeCustomer;
    try {
      stripeCustomer = await stripe.customers.create({
        email: user.email, // Assuming 'email' is part of the 'data' object
        name: data.firstName + " " + data.lastName,   // Assuming 'name' is also part of the 'data' object
        description: `Donor ID ${id}`,
        metadata: {
          donorId: id, // Assuming `success` has the created project ID
        }
      });
    } catch (err) {
      throw new Error('Failed to create user in Stripe: ' + err.message);
    }

    const donorData = {
      ...data,
      user: id,
      totalDonation: 0,
      stripeId: stripeCustomer.id, // Add the Stripe customer ID
    };

    return await DonorRepository.create(donorData);
  }

  async getDonatedProjects(limit, after, id) {

    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const donor = await DonorRepository.findByUser(user);
    if (!donor) {
      throw new Error('Donor not found')
    }

    try {
      // Retrieve all Checkout sessions for the customer
      const sessions = await stripe.checkout.sessions.list({
        customer: donor.stripeId,
      });

      const donatedProjects = new Set();

      // Loop through each session to get the projectId from metadata
      for (const session of sessions.data) {
        // Check if the projectId exists in the metadata
        if (session.metadata && session.metadata.productId) {
          donatedProjects.add(session.metadata.productId); // Use Set to avoid duplicates
        }
      }

      console.log(donatedProjects)

      // Fetch details for each unique project
      const projectDetails = [];
      for (const projectId of donatedProjects) {
        const project = await projectRepository.findByStripeId(projectId);
        console.log(project);
        // TODO: Logic rework here, during testing purpose, deletion of project in database wont delete the product on stripe; therefore, there is a chance of the repo return null object
        if (project) {
          projectDetails.push(project);
        } else {
          // TODO: Logic here
        }
      }

      return projectDetails;

    } catch (error) {
      console.error('Error retrieving purchased products:', error);
      throw error;
    }
  }

}

module.exports = new DonorService();
