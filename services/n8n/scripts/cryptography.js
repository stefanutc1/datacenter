const crypto = require('crypto');

function verifyWebhookSignature(requestBody, receivedSignature, secretKey) {
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(JSON.stringify(requestBody));
    const calculatedSignature = hmac.digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(calculatedSignature, 'hex'),
        Buffer.from(receivedSignature, 'hex')
    );
}

// usage example in n8n:
// const body = $input.item.json;
// const signature = $node["Webhook"].parameter["headers"]["x-hub-signature"];
// const isValid = verifyWebhookSignature(body, signature, "SECRET_KEY_TAUL");
// return { json: { isValid } };
