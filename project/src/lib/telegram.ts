const STORAGE_TOKEN_KEY = 'prox_tg_bot_token';
const STORAGE_CHAT_KEY = 'prox_tg_chat_id';

const DEFAULT_TOKEN =
  (import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string) ||
  '9266574853:AAGnXIDLaXzu9SREvFfu9ZCjJNnmlGtMpLs';

const DEFAULT_CHAT_ID =
  (import.meta.env.VITE_TELEGRAM_CHAT_ID as string) || '8990136215';

export interface TelegramConfig {
  token: string;
  chatId: string;
}

export function getTelegramConfig(): TelegramConfig {
  let token = DEFAULT_TOKEN;
  let chatId = DEFAULT_CHAT_ID;

  if (typeof window !== 'undefined') {
    const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    const savedChatId = localStorage.getItem(STORAGE_CHAT_KEY);
    if (savedToken) token = savedToken;
    if (savedChatId) chatId = savedChatId;
  }

  return { token: token.trim(), chatId: chatId.trim() };
}

export function setTelegramConfig(token: string, chatId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_TOKEN_KEY, token.trim());
    localStorage.setItem(STORAGE_CHAT_KEY, chatId.trim());
  }
}

export interface TelegramLeadPayload {
  source: string; // e.g., 'Aloqa Formasi (Contact)' or 'Konsultatsiya Modali'
  name: string;
  phone: string;
  service_type: string;
  message?: string | null;
}

// Safely escape characters that could break Telegram HTML parse mode
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendTelegramNotification(
  lead: TelegramLeadPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const { token, chatId } = getTelegramConfig();

    if (!token || !chatId) {
      console.warn('Telegram Bot Token or Chat ID not configured');
      return { success: false, error: 'Telegram credentials missing' };
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const safeSource = escapeHtml(lead.source);
    const safeName = escapeHtml(lead.name.trim());
    const safePhone = escapeHtml(lead.phone.trim());
    const safeService = escapeHtml(lead.service_type);
    const safeMessage = lead.message ? escapeHtml(lead.message.trim()) : '<i>Kiritilmagan</i>';

    const text = `🚀 <b>YANGI MUROJAAT | PROX AGENCY</b>

📌 <b>Manba:</b> ${safeSource}
👤 <b>Ism:</b> ${safeName}
📞 <b>Telefon:</b> <a href="tel:${safePhone}">${safePhone}</a>
💼 <b>Xizmat turi:</b> ${safeService}
💬 <b>Xabar:</b>
${safeMessage}

⏰ <b>Sana va vaqt:</b> ${formattedDate}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.warn('Telegram API response error:', result);
      return {
        success: false,
        error: result.description || 'Failed to send to Telegram',
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Telegram notification error:', err);
    return {
      success: false,
      error: err?.message || 'Network error sending to Telegram',
    };
  }
}

export async function sendTelegramTestMessage(
  customToken?: string,
  customChatId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cfg = getTelegramConfig();
    const token = (customToken || cfg.token).trim();
    const chatId = (customChatId || cfg.chatId).trim();

    if (!token || !chatId) {
      return { success: false, error: "Bot tokeni yoki Chat ID kiritilmagan" };
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const text = `✅ <b>PROX MARKETING AGENCY — TEST XABARI</b>

🤖 <b>Telegram Bot:</b> Muvaffaqiyatli ulandi!
🎯 <b>Status:</b> Faol va yangi lidlarni qabul qilishga tayyor.
⏰ <b>Tekshiruv vaqti:</b> ${formattedDate}

<i>Bu xabar Admin Panel boshqaruv tizimidan yuborildi.</i>`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return {
        success: false,
        error: result.description || 'Telegram xabar yuborishda xatolik',
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Telegram serveriga ulanishda xatolik yuz berdi",
    };
  }
}
