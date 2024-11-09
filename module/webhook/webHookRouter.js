const express = require('express');
const WebHookController = require('./webHookController');
const WebHookRouter = express.Router();

WebHookRouter.post(
    '/handle',
    WebHookController.handleWebhook
);

module.exports = WebHookRouter;