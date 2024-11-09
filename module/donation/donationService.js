const ProjectRepository = require('../project/projectRepository');
const DonorRepository = require('../donor/donorRepository');
const UserRepository = require('../user/userRepository')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your actual secret key

class DonationService {
    // Service to get a donor by ID
    async donate(id, data) {
        const user = await UserRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        const donor = await DonorRepository.findByUser(user);
        if (!donor) {
            throw new Error('Donor not found');
        }

        const project = await ProjectRepository.findById(data.projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        // Check if data.amount is a number and if it's an integer or a double
        if (typeof data.amount !== 'number' || isNaN(data.amount)) {
            throw new Error('Amount must be a valid number');
        }

        // console.log(product.data[0].id);
        const session = await stripe.checkout.sessions.create({
            customer: donor.stripeId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product: project.stripeId,
                        unit_amount: data.amount,
                    },
                    quantity: 1,
                },
            ],
            custom_fields: [
                {
                    key: 'message',
                    label: {
                        type: 'custom',
                        custom: 'Leave your message',
                    },
                    type: 'text',
                    optional: 'true'
                },
            ],
            metadata: {
                productId: project.stripeId, // Add the product ID to metadata
            },
            mode: 'payment',
            // Change the url later
            success_url: 'http://localhost:5500/success',
            cancel_url: 'http://localhost:5500/cancel',
            saved_payment_method_options: {
                payment_method_save: 'enabled',
            },
        });
        return session.url;
    }

    // Service to get all Donations
    async getAllDonations(limit, after) {

        if (after != '') {
            const sessions = await stripe.checkout.sessions.list({
                limit: limit,
                starting_after: after,
                status: 'complete'
            });
            return sessions;
        }

        const sessions = await stripe.checkout.sessions.list({
            limit: limit,
            status: 'complete'
        });

        return sessions;
    }

    // Service to get my Donations
    async getMyDonations(limit, after, donorId) {

        const user = await UserRepository.findById(donorId);
        if (!user) {
            throw new Error('User not found');
        }

        const donor = await DonorRepository.findByUser(user);
        if (!donor) {
            throw new Error('Donor not found');
        }

        if (after != '') {
            const sessions = await stripe.checkout.sessions.list({
                limit: limit,
                starting_after: after,
                status: 'complete',
                customer: donor.stripeId
            });
            return sessions;
        }

        const sessions = await stripe.checkout.sessions.list({
            limit: limit,
            status: 'complete',
            customer: donor.stripeId,
        });

        return sessions;
    }
}

module.exports = new DonationService();
