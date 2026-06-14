const { createClient } = require('@supabase/supabase-js');
const SCHEDULE = require('../../src/data/schedule.json');

const WORKOUT_INFO = {
  'push-a':   { label: 'Push Day A',         focus: 'Chest · Shoulders · Triceps' },
  'pull-a':   { label: 'Pull Day A',          focus: 'Back · Biceps · Rear Delts' },
  'legs-a':   { label: 'Legs Day A',          focus: 'Quads · Hamstrings · Glutes' },
  'core':     { label: 'Core & Mobility Day', focus: 'Stability · Anti-Rotation · Flexibility' },
  'push-b':   { label: 'Push Day B',          focus: 'Chest · Shoulders · Triceps (Volume)' },
  'pull-b':   { label: 'Pull Day B',          focus: 'Back · Biceps (Strength + Stretch)' },
  'legs-b':   { label: 'Legs Day B',          focus: 'Quads · Glutes · Hamstrings (Accessory)' },
  'recovery': { label: 'Active Recovery',     focus: 'Cardio · Mobility · Blood Flow' },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTodayIndex(joinedAt, seed = 0) {
  const SCHEDULE_LENGTH = 30
  let dayIndex
  if (joinedAt) {
    const start = new Date(joinedAt)
    start.setHours(0, 0, 0, 0)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const days = Math.floor((now - start) / 86400000)
    dayIndex = days
  } else {
    dayIndex = new Date().getDate() - 1
  }
  return (dayIndex + seed) % SCHEDULE_LENGTH
}

// Convert stored UTC HH:MM to the user's local time, then check if it matches now.
// The stored time is already in UTC so we just compare directly to current UTC.
function getCurrentUTCTime() {
  const now = new Date();
  return `${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')}`;
}

// ── Email ─────────────────────────────────────────────────────────────────────

function buildEmailHTML(username, label, focus, siteUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Today's Program — NGM</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Inter,Arial,Helvetica,sans-serif;color:#0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding:0 0 24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0a0a0a;border-radius:14px;width:46px;height:46px;text-align:center;vertical-align:middle;">
                    <span style="font-size:13px;font-weight:900;letter-spacing:.08em;color:#ffffff;line-height:46px;display:block;">NGM</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border:1px solid #e5e5e5;border-radius:24px;padding:36px;">
              <p style="margin:0 0 20px;font-size:11px;font-weight:900;letter-spacing:.22em;text-transform:uppercase;color:#888888;">
                <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#0a0a0a;margin-right:10px;vertical-align:middle;"></span>
                Today's Program
              </p>
              <h1 style="margin:0;font-size:38px;font-weight:900;letter-spacing:-.04em;line-height:.96;text-transform:uppercase;color:#0a0a0a;">
                ${label.toUpperCase()}
              </h1>
              <div style="margin:18px 0 0;display:inline-block;border:1px solid #e5e5e5;background:#f4f4f4;border-radius:999px;padding:7px 15px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#555555;">
                ${focus}
              </div>
              <hr style="border:0;border-top:1px solid #eeeeee;margin:28px 0;"/>
              <p style="margin:0 0 28px;font-size:16px;color:#555555;line-height:1.6;">
                Hey ${username} — your program is ready. Stop guessing, start progressing.
              </p>
              <a href="${siteUrl}/workout" style="display:inline-block;background:#0a0a0a;color:#ffffff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;letter-spacing:.02em;">
                View Today's Workout →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
                You're receiving this because you enabled workout reminders.<br/>
                <a href="${siteUrl}/settings" style="color:#888888;text-decoration:underline;">Manage reminder settings</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── SMS ───────────────────────────────────────────────────────────────────────

function buildSMSBody(username, label, focus, siteUrl) {
  return [
    `NoGuessMethod`,
    `Hey ${username}, today's workout is ${label}.`,
    `${focus}`,
    `View it here: ${siteUrl}/workout`,
    `Reply STOP to unsubscribe.`,
  ].join('\n');
}

async function sendSMS({ to, username, label, focus, siteUrl, accountSid, authToken, fromNumber }) {
  const body = buildSMSBody(username, label, focus, siteUrl);
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      },
      body: new URLSearchParams({ Body: body, From: fromNumber, To: to }).toString(),
    }
  );
  if (!res.ok) {
    const b = await res.text();
    throw new Error(`Twilio error: ${b}`);
  }
}

// ── Email sender ───────────────────────────────────────────────────────────────

async function sendEmail({ to, username, label, focus, siteUrl, resendKey }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from:    'NGM <reminders@noguessmethod.com>',
      to:      [to],
      subject: `Today's Program: ${label}`,
      html:    buildEmailHTML(username, label, focus, siteUrl),
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error: ${body}`);
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────

exports.handler = async () => {
  const sb = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const SITE_URL    = process.env.SITE_URL ?? 'https://noguessmethod.com';
  const RESEND_KEY  = process.env.RESEND_API_KEY;
  const TWILIO_SID  = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER;

  // Current UTC time as HH:MM
  const currentUTC = getCurrentUTCTime();
  console.log(`Running reminders at UTC: ${currentUTC}`);

  const { data: users, error } = await sb
    .from('profiles')
    .select('id, username, reminder_time, reminder_timezone, reminder_email_enabled, reminder_sms_enabled, phone_number, phone_verified, joined_at, schedule_seed')
    .or('reminder_email_enabled.eq.true,reminder_sms_enabled.eq.true')
    .not('reminder_time', 'is', null);

  if (error) {
    console.error('Supabase fetch error:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  if (!users?.length) {
    console.log('No users with reminders enabled');
    return { statusCode: 200, body: JSON.stringify({ sent: 0 }) };
  }

  const results = { email: { sent: 0, failed: 0 }, sms: { sent: 0, failed: 0 } };

  await Promise.allSettled(users.map(async (user) => {
    // reminder_time is already stored in UTC — compare directly to current UTC
    const storedUTC = (user.reminder_time ?? '').slice(0, 5); // HH:MM

    const [uh, um] = storedUTC.split(':').map(Number);
    const [ch, cm] = currentUTC.split(':').map(Number);
    const userMins = uh * 60 + um;
    const currMins = ch * 60 + cm;

    console.log(`User ${user.username}: stored UTC=${storedUTC}, current UTC=${currentUTC}, diff=${Math.abs(userMins - currMins)}min`);

    // Match within a 7-minute window to account for scheduler drift
    if (Math.abs(userMins - currMins) > 7) return;

    const idx     = getTodayIndex(user.joined_at, user.schedule_seed ?? 0);
    const key     = SCHEDULE[idx];
    const workout = WORKOUT_INFO[key];
    const name    = user.username ?? 'there';

    if (user.reminder_email_enabled && RESEND_KEY) {
      try {
        const { data: authUser } = await sb.auth.admin.getUserById(user.id);
        const email = authUser?.user?.email;
        if (email) {
          await sendEmail({ to: email, username: name, label: workout.label, focus: workout.focus, siteUrl: SITE_URL, resendKey: RESEND_KEY });
          results.email.sent++;
          console.log(`Email sent to ${email}`);
        }
      } catch (err) {
        console.error(`Email failed for ${user.id}:`, err.message);
        results.email.failed++;
      }
    }

    if (user.reminder_sms_enabled && user.phone_verified && user.phone_number && TWILIO_SID) {
      try {
        await sendSMS({ to: user.phone_number, username: name, label: workout.label, focus: workout.focus, siteUrl: SITE_URL, accountSid: TWILIO_SID, authToken: TWILIO_AUTH, fromNumber: TWILIO_FROM });
        results.sms.sent++;
        console.log(`SMS sent to ${user.phone_number}`);
      } catch (err) {
        console.error(`SMS failed for ${user.id}:`, err.message);
        results.sms.failed++;
      }
    }
  }));

  console.log('Reminder results:', JSON.stringify(results));
  return { statusCode: 200, body: JSON.stringify(results) };
};
