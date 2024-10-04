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
    // parsedData.delete('hash');

    // Log parsed data for debugging
    console.log('Parsed Data:', Object.fromEntries(parsedData));

    // Remove 'hash' value & Sort alphabetically
	const data_keys = Object.keys(parsedData).filter(v => v !== 'hash').sort()
    console.log('Data keys 1:', data_keys);

	// Create line format key=<value>
	const items = data_keys.map(key => key + '=' + parsedData[key])
    console.log('Data keys 11:', items);

	// Create check string with a line feed
	// character ('\n', 0x0A) used as separator
	// result: 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>'
	const data_check_string = items.join('\n')
    console.log('Data keys 111:', data_check_string);

    console.log('Data String for HMAC:', data_check_string);

    const hmac = crypto.createHmac('sha256', secretKey).update(data_check_string).digest('hex');
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
