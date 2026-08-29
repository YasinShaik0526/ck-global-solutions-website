const jsonHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export default async (request) => {
  if (request.method !== 'POST') {
    return jsonResponse(405, { success: false, message: 'Method not allowed' })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return jsonResponse(400, { success: false, message: 'Invalid request body' })
  }

  const name = clean(body.name, 100)
  const email = clean(body.email, 200)
  const message = clean(body.message, 2000)

  if (!name || !email || !message) {
    return jsonResponse(400, { success: false, message: 'Name, email, and message are required' })
  }

  const accessToken = Netlify.env.get('WHATSAPP_ACCESS_TOKEN')
  const phoneNumberId = Netlify.env.get('WHATSAPP_PHONE_NUMBER_ID')
  const recipientNumber = Netlify.env.get('WHATSAPP_RECIPIENT_NUMBER') || '919985727179'
  const templateName = Netlify.env.get('WHATSAPP_TEMPLATE_NAME')
  const templateLanguage = Netlify.env.get('WHATSAPP_TEMPLATE_LANGUAGE') || 'en_US'

  if (!accessToken || !phoneNumberId) {
    console.error('Missing WhatsApp Cloud API environment variables')
    return jsonResponse(503, { success: false, message: 'WhatsApp service is not configured' })
  }

  const notification = templateName
    ? {
        messaging_product: 'whatsapp',
        to: recipientNumber,
        type: 'template',
        template: {
          name: templateName,
          language: { code: templateLanguage },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: name },
                { type: 'text', text: email },
                { type: 'text', text: message },
              ],
            },
          ],
        },
      }
    : {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientNumber,
        type: 'text',
        text: {
          preview_url: false,
          body: `New C&K Global website enquiry\n\nName: ${name}\nEmail: ${email}\n\n${message}`,
        },
      }

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    },
  )

  const result = await response.json()
  if (!response.ok) {
    console.error('WhatsApp Cloud API request failed', result)
    return jsonResponse(502, { success: false, message: 'WhatsApp delivery failed' })
  }

  return jsonResponse(200, {
    success: true,
    messageId: result.messages?.[0]?.id ?? null,
  })
}
