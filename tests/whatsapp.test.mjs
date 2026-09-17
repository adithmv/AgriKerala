import test from 'node:test'
import assert from 'node:assert/strict'
import { BUSINESS_WHATSAPP_NUMBER, createWhatsAppOrderUrl } from '../lib/whatsapp.js'

test('order URL always targets the website business number', () => {
  const url = new URL(createWhatsAppOrderUrl('I want Tomato Seeds & Grow Bags'))

  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/919895526079')
  assert.equal(url.searchParams.get('text'), 'I want Tomato Seeds & Grow Bags')
})

test('business number uses WhatsApp international digits-only format', () => {
  assert.match(BUSINESS_WHATSAPP_NUMBER, /^[1-9]\d{7,14}$/)
})
