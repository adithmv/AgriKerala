export const BUSINESS_WHATSAPP_NUMBER = '919895526079'
export const BUSINESS_PHONE_DISPLAY = '+91 98955 26079'

export function createWhatsAppOrderUrl(message) {
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
