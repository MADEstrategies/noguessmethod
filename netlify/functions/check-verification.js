const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

// Normalize user input to E.164. Defaults bare 10/11-digit numbers to US (+1).
function normalizePhone(raw) {
  if (!raw) return null;
  const p = String(raw).trim().replace(/[\s\-().]/g, '');
  if (p.startsWith('+')) {
    const digits = p.slice(1).replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }
  const digits = p.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return json(401, { error: 'Missing auth token' });
  }
  const token = authHeader.slice(7);

  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) {
    return json(401, { error: 'Invalid session' });
  }

  const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
  const VERIFY_SID = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!TWILIO_SID || !TWILIO_AUTH || !VERIFY_SID) {
    return json(500, {
      error: 'SMS verification is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID.',
    });
  }

  const { phone, code } = JSON.parse(event.body || '{}');
  const to = normalizePhone(phone);
  if (!to) {
    return json(400, { error: 'Enter a valid phone number, including country code (e.g. +1 212 555 1234).' });
  }
  const cleanCode = String(code ?? '').trim();
  if (!/^\d{4,10}$/.test(cleanCode)) {
    return json(400, { error: 'Enter the code from the text message.' });
  }

  try {
    const client = twilio(TWILIO_SID, TWILIO_AUTH);
    const result = await client.verify.v2
      .services(VERIFY_SID)
      .verificationChecks.create({ to, code: cleanCode });

    if (result.status !== 'approved') {
      return json(400, { verified: false, error: 'Incorrect or expired code. Try again.' });
    }

    const { error: updateError } = await sb
      .from('profiles')
      .update({ phone_number: to, phone_verified: true })
      .eq('id', user.id);

    if (updateError) {
      return json(500, { error: updateError.message });
    }

    return json(200, { success: true, verified: true, phone: to });
  } catch (err) {
    const clientError = err.status && err.status >= 400 && err.status < 500;
    return json(clientError ? 400 : 500, { error: err.message || 'Failed to verify code' });
  }
};
