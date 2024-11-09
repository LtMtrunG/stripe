const WebHookService = require('./webHookService');

class WebHookController {

    async handleWebhook(req, res) {
        const signature = req.headers['stripe-signature'];
        try {
            const event = WebHookService.verifyEvent(req.body, signature);
            WebHookService.handleEvent(event);
            res.status(200).json({ received: true });
        } catch (err) {
            console.error(err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}

module.exports = new WebHookController();
