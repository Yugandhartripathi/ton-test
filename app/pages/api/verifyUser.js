import crypto from 'crypto';

export default async function handler(req, res) {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ error: 'Missing initData' });
  }

  // const BOT_TOKEN = process.env.BOT_TOKEN; // Set your bot token here or in the environment variables
  const secretKey = crypto.createHash('sha256').update("7960033776:AAFKDCIWnYHL9xMjZHvY4ARwSvUaX45PFG4").digest();
  console.log(secretKey)

  const parsedData = new URLSearchParams(initData);
  const hash = parsedData.get('hash');
  parsedData.delete('hash');

  // Create a data string by sorting keys alphabetically
  const dataString = Array.from(parsedData.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const hmac = crypto.createHmac('sha256', secretKey).update(dataString).digest('hex');

  if (hmac !== hash) {
    return res.status(403).json({ error: 'Invalid initData' });
  }

  res.status(200).json({ verified: true, user: Object.fromEntries(parsedData) });
}
