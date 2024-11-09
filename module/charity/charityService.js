require('dotenv').config();
const CharityRepository = require('./charityRepository');
const UserRepository = require('../user/userRepository');
const { validateCharityRegisterRequest } = require('./charityDto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your actual secret key

class CharityService {
  // Service to update a Charity by ID
  async updateCharity(id, data) {
    const updatedCharity = await CharityRepository.update(id, data);
    if (!updatedCharity) {
      throw new Error('Charity not found or update failed');
    }
    return updatedCharity;
  }

  // Service to update charity's card
  async updateCard(id, data) {
    const Charity = await CharityRepository.findById(id);
    if (!Charity) {
      throw new Error('Charity not found');
    }

    const { newPaymentMethodId } = data;

    try {
      // Step 1: Attach the new payment method to the customer
      await stripe.paymentMethods.attach(newPaymentMethodId, {
        customer: Charity.stripeId,
      });

      // Step 2: Set the new payment method as the default payment method (optional)
      await stripe.customers.update(Charity.stripeId, {
        invoice_settings: {
          default_payment_method: newPaymentMethodId,
        },
      });

      // Step 3: Get the customer's existing payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: Charity.stripeId,
        type: 'card',
      });

      // Step 4: Detach the old payment method if it exists
      if (paymentMethods.data.length > 0) {
        const oldPaymentMethodId = paymentMethods.data[0].id; // Get the first payment method

        await stripe.paymentMethods.detach(oldPaymentMethodId);
      }

      res.json({ success: true, newPaymentMethodId });
    } catch (error) {
      console.error('Error replacing card:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createCharity(data, id) {

    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isVerified) {
      throw new Error('This User has NOT verified the email for register!');
    }

    const { error } = validateCharityRegisterRequest(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Create the Stripe customer
    let stripeCustomer;
    try {
      stripeCustomer = await stripe.customers.create({
        email: user.email, // Assuming 'email' is part of the 'data' object
        name: data.companyName,   // Assuming 'name' is also part of the 'data' object
        description: `Charity ID ${id}`,
        metadata: {
          charityId: id, // Assuming `success` has the created project ID
        }
      });
    } catch (err) {
      throw new Error('Failed to create user in Stripe: ' + err.message);
    }

    // Add the Stripe ID to the charity data
    const charityData = {
      ...data,
      user: id,
      stripeId: stripeCustomer.id, // Add the Stripe customer ID
    };

    return await CharityRepository.create(charityData);
  }
}

module.exports = new CharityService();
