import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  const { initData } = await request.json();

  if (!initData) {
    return NextResponse.json({ error: 'Missing initData' }, { status: 400 });
  }

 // const BOT_TOKEN = process.env.BOT_TOKEN; // Set your bot token here or in the environment variables
  const secretKey = crypto.createHash('sha256').update("7960033776:AAFKDCIWnYHL9xMjZHvY4ARwSvUaX45PFG4").digest();

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
    return NextResponse.json({ error: 'Invalid initData' }, { status: 403 });
  }

  return NextResponse.json({ verified: true }, { status: 200 });
}
