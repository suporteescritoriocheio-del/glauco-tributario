// WhatsApp messages configuration per page
// Maps page titles to contextual WhatsApp messages

export const whatsappMessages: Record<string, string> = {
  // Fraude PIX page messages
  'Recuperação de Dinheiro em Fraude Pix e Golpes': 'Olá, fui vítima de golpe no Pix e preciso de ajuda urgente',

  // PAD page messages
  'Defesa Administrativa (PAD)': 'Olá, preciso de defesa urgente em PAD',

  // Saúde page messages
  'Liminar contra Plano de Saúde e SUS': 'Olá, preciso de ajuda urgente com meu plano de saúde',

  // Empresarial page messages
  'Advocacia Empresarial e Consultoria': 'Olá, gostaria de agendar uma consultoria com o Dr. Glauco',

  // Default fallback
  'default': 'Olá, gostaria de conversar com um especialista'
};

export function getWhatsAppMessage(pageTitle?: string): string {
  if (!pageTitle) return whatsappMessages.default;

  // Try exact match first
  if (pageTitle in whatsappMessages) {
    return whatsappMessages[pageTitle];
  }

  // Try partial match
  const normalized = pageTitle.toLowerCase();
  for (const [key, message] of Object.entries(whatsappMessages)) {
    if (key !== 'default' && normalized.includes(key.toLowerCase())) {
      return message;
    }
  }

  return whatsappMessages.default;
}

// Escape text for URL encoding
export function escapeWhatsAppText(text: string): string {
  return encodeURIComponent(text);
}

// Build WhatsApp URL
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = escapeWhatsAppText(message);
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
}
