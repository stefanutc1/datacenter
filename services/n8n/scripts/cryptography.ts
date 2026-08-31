import * as crypto from 'crypto';

export function verifyWebhookSignature(
  requestBody: Record<string, unknown> | string,
  receivedSignature: string,
  secretKey: string
): boolean {
  const payload = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody);
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(payload);
  const calculatedSignature = hmac.digest('hex');

  const calculatedBuffer = Buffer.from(calculatedSignature, 'hex');
  const receivedBuffer = Buffer.from(receivedSignature, 'hex');

  if (calculatedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(calculatedBuffer, receivedBuffer);
}
