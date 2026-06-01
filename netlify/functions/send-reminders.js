const { createClient } = require('@supabase/supabase-js');

const SCHEDULE = require('../../src/data/schedule.json');

const WORKOUT_INFO = {
  'push-a':   { label: 'Push Day A',          focus: 'Chest · Shoulders · Triceps' },
  'pull-a':   { label: 'Pull Day A',           focus: 'Back · Biceps · Rear Delts' },
  'legs-a':   { label: 'Legs Day A',           focus: 'Quads · Hamstrings · Glutes' },
  'core':     { label: 'Core & Mobility Day',  focus: 'Stability · Anti-Rotation · Flexibility' },
  'push-b':   { label: 'Push Day B',           focus: 'Chest · Shoulders · Triceps (Volume)' },
  'pull-b':   { label: 'Pull Day B',           focus: 'Back · Biceps (Strength + Stretch)' },
  'legs-b':   { label: 'Legs Day B',           focus: 'Quads · Glutes · Hamstrings (Accessory)' },
  'recovery': { label: 'Active Recovery',      focus: 'Cardio · Mobility · Blood Flow' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayIndex(joinedAt) {
  const start = new Date(joinedAt);
  start.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const days = Math.floor((now - start) / 86400000);
  return days % SCHEDULE.length;
}

// Convert a local HH:MM + IANA timezone to UTC HH:MM
function localTimeToUTC(timeStr, timezone) {
  const [hh, mm] = timeStr.split(':').map(Number);
  const now = new Date();
  const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0);
  const utcDate  = new Date(localDate.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate   = new Date(localDate.toLocaleString('en-US', { timeZone: timezone }));
  const diff     = utcDate - tzDate;
  const utc      = new Date(localDate.getTime() + diff);
  return `${String(utc.getHours()).padStart(2,'0')}:${String(utc.getMinutes()).padStart(2,'0')}`;
}

// Current UTC time as HH:MM
function getCurrentUTCTime() {
  const now = new Date();
  return `${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')}`;
}

// ─── Email ────────────────────────────────────────────────────────────────────

function buildEmailHTML(username, label, focus, siteUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Today's Program — NGM</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:Inter,Arial,Helvetica,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td style="padding:0 0 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#000;border:1px solid rgba(255,255,255,.14);border-radius:14px;width:46px;height:46px;text-align:center;vertical-align:middle;">
                    <span style="font-size:13px;font-weight:900;letter-spacing:.08em;color:#fff;">NGM</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.025));border:1px solid rgba(255,255,255,.14);border-radius:28px;padding:36px;">

              <p style="margin:0 0 20px;font-size:12px;font-weight:900;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.78);">
                <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#fff;margin-right:10px;vertical-align:middle;"></span>
                Today's Program
              </p>

              <h1 style="margin:0 0 6px;font-size:42px;font-weight:900;letter-spacing:-.065em;line-height:.92;text-transform:uppercase;color:#ffffff;">
                ${label.toUpperCase()}
              </h1>

              <p style="margin:16px 0 0;display:inline-block;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);border-radius:999px;padding:7px 15px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fff;">
                ${focus}
              </p>

              <hr style="border:0;border-top:1px solid rgba(255,255,255,.14);margin:28px 0;"/>

              <p style="margin:0 0 28px;font-size:16px;color:rgba(255,255,255,.68);line-height:1.6;">
                Hey ${username} — your program is ready. Stop guessing, start progressing.
              </p>

              <a href="${siteUrl}/workout"
                 style="display:inline-block;background:#ffffff;color:#000000;font-size:14px;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;letter-spacing:.02em;">
                View Today's Workout →
              </a>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0 0;text-align:center;">
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,.35);line-height:1.6;">
                You're receiving this because you enabled email reminders.<br/>
                <a href="${siteUrl}/settings" style="color:rgba(255,255,255,.45);text-decoration:underline;">
                  Manage reminder settings
                </a>
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

// ─── SMS ─────────────────────────────────────────────────────────────────────

function buildSMSBody(username, label, focus, siteUrl) {
  return [
    `NGM Daily Reminder`,
    `Hey ${username} — today is ${label}.`,
    `${focus}`,
    `${siteUrl}/workout`,
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

// ─── Handler ─────────────────────────────────────────────────────────────────

exports.handler = async () => {
  const sb = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const SITE_URL    = process.env.SITE_URL    ?? 'https://noguessmethod.com';
  const RESEND_KEY  = process.env.RESEND_API_KEY;
  const TWILIO_SID  = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER;

  const currentUTC = getCurrentUTCTime(); // e.g. "07:30"

  // Fetch all users with at least one reminder enabled
  const { data: users, error } = await sb
    .from('profiles')
    .select('id, username, reminder_time, reminder_timezone, reminder_email_enabled, reminder_sms_enabled, phone_number, joined_at')
    .or('reminder_email_enabled.eq.true,reminder_sms_enabled.eq.true')
    .not('reminder_time', 'is', null);

  if (error) {
    console.error('Supabase fetch error:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  if (!users?.length) {
    return { statusCode: 200, body: JSON.stringify({ sent: 0 }) };
  }

  const results = { email: { sent: 0, failed: 0 }, sms: { sent: 0, failed: 0 } };

  await Promise.allSettled(users.map(async (user) => {
    // Convert user's stored reminder_time to UTC and check if it matches now
   const reminderTime = (user.reminder_time ?? '').slice(0, 5);
const userUTC = localTimeToUTC(reminderTime, user.reminder_timezone ?? 'America/New_York');
if (userUTC !== currentUTC) return;

    // Get today's workout for this user
    const idx     = getTodayIndex(user.joined_at);
    const key     = SCHEDULE[idx];
    const workout = WORKOUT_INFO[key];
    const name    = user.username ?? 'there';

    // Get email from auth.users if email reminder enabled
    if (user.reminder_email_enabled && RESEND_KEY) {
      try {
        const { data: authUser } = await sb.auth.admin.getUserById(user.id);
        const email = authUser?.user?.email;
        if (email) {
          await sendEmail({
            to: email, username: name,
            label: workout.label, focus: workout.focus,
            siteUrl: SITE_URL, resendKey: RESEND_KEY,
          });
          results.email.sent++;
        }
      } catch (err) {
        console.error(`Email failed for ${user.id}:`, err.message);
        results.email.failed++;
      }
    }

    // Send SMS if enabled and phone number exists
    if (user.reminder_sms_enabled && user.phone_number && TWILIO_SID) {
      try {
        await sendSMS({
          to: user.phone_number, username: name,
          label: workout.label, focus: workout.focus,
          siteUrl: SITE_URL,
          accountSid: TWILIO_SID, authToken: TWILIO_AUTH, fromNumber: TWILIO_FROM,
        });
        results.sms.sent++;
      } catch (err) {
        console.error(`SMS failed for ${user.id}:`, err.message);
        results.sms.failed++;
      }
    }
  }));

  console.log('Reminders:', JSON.stringify(results));
  return { statusCode: 200, body: JSON.stringify(results) };
};
