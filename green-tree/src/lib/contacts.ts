// Contact details come from the environment so they can change without a release.
// WHATSAPP_NUMBER: international format without "+", e.g. 9665XXXXXXXX
export const whatsappNumber = process.env.WHATSAPP_NUMBER ?? ''

export function whatsappLink(text?: string) {
  const base = whatsappNumber ? `https://wa.me/${whatsappNumber}` : 'https://wa.me/'
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
