// Vercel Serverless Function: Telegram bot tokenini brauzerdan yashiradi.
// Token va chat ID Vercel loyihasi Environment Variables bo'limida saqlanadi,
// shu fayl ichida hech qachon ko'rinmaydi.

const ALLOWED_ORIGINS = [
  'https://mazamov.me',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { text } = req.body || {};
  if (!text || typeof text !== 'string' || text.length > 2000) {
    res.status(400).json({ error: 'Invalid text' });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ error: 'Server not configured' });
    return;
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    const data = await tgRes.json();
    res.status(tgRes.ok ? 200 : 502).json({ ok: data.ok === true });
  } catch (err) {
    res.status(502).json({ error: 'Telegram request failed' });
  }
};
