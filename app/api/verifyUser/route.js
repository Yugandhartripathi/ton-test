import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { initData } = await request.json();

    if (!initData) {
      return NextResponse.json({ error: 'Missing initData' }, { status: 400 });
    }

    const BOT_TOKEN = process.env.BOT_TOKEN; // Ensure BOT_TOKEN is correct
    console.log('BOT_TOKEN:', BOT_TOKEN); // Log the bot token to verify it is correctly loaded

    const secretKey = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
    console.log('Secret key', secretKey);

    const parsedData = new URLSearchParams(initData);
    const hash = parsedData.get('hash');
    parsedData.delete('hash');

    // Log parsed data for debugging
    console.log('Parsed Data:', Object.fromEntries(parsedData));

    // 2. Building the verification string.
    const dataString = Object.keys(parsedData)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join("\n");

    console.log("dataCheckString", dataString);

    console.log('Data String for HMAC:', dataString);

    const hmac = crypto.createHmac('sha256', secretKey).update(dataString).digest('hex');
    console.log('Calculated HMAC:', hmac);
    console.log('Provided Hash:', hash);

    if (hmac !== hash) {
      return NextResponse.json({ error: 'Invalid initData' }, { status: 403 });
    }

    return NextResponse.json({ verified: true }, { status: 200 });
  } catch (error) {
    console.error('Verification server error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
