const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your actual secret key
const donorRepository = require('../donor/donorRepository')
const projectRepository = require('../project/projectRepository')
class WebHookService {

    verifyEvent(payload, signature) {
        try {
            return stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            throw new Error(`Webhook signature verification failed: ${err.message}`);
        }
    }

    async handleEvent(event) {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('Payment was successful:', session);
                const donor = await donorRepository.findByStripeId(session.customer);
                if (!donor) {
                    throw new Error(`Donor not found!`)
                }
                await donorRepository.update(donor.id, { totalDonation: donor.totalDonation + session.amount_total });

                const project = await projectRepository.findByStripeId(session.metadata.productId);
                if (!project) {
                    throw new Error(`Project not found!`)
                }
                await projectRepository.update(project.id, { raisedAmount: project.raisedAmount + session.amount_total });
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
}

module.exports = new WebHookService();
