// Vercel Serverless Function
// Bu faylni Vercel'ga deploy qilasiz

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' });
        }

        // Telegram bot credentials from environment variables
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Prepare Telegram message
        const telegramMessage = `
🔔 <b>Yangi Xabar Portfolio'dan</b>

👤 <b>Ism:</b> ${name}
📧 <b>Email:</b> ${email}
📝 <b>Mavzu:</b> ${subject}

💬 <b>Xabar:</b>
${message}

⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
        `;

        // Send to Telegram
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();

        if (result.ok) {
            return res.status(200).json({ 
                success: true, 
                message: 'Xabar muvaffaqiyatli yuborildi!' 
            });
        } else {
            throw new Error('Telegram API error');
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.' 
        });
    }
}
