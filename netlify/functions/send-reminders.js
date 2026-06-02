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
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Inter,Arial,Helvetica,sans-serif;color:#0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
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

          <!-- Main card -->
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

              <a href="${siteUrl}/workout"
                 style="display:inline-block;background:#0a0a0a;color:#ffffff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;letter-spacing:.02em;">
                View Today's Workout →
              </a>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
                You're receiving this because you enabled workout reminders.<br/>
                <a href="${siteUrl}/settings" style="color:#888888;text-decoration:underline;">
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

// ─── Handler ─────────────────────────────────────────────────────────────────

exports.handler = async () => {
  const sb = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const SITE_URL   = process.env.SITE_URL ?? 'https://noguessmethod.com';
  const RESEND_KEY = process.env.RESEND_API_KEY;

  const currentUTC = getCurrentUTCTime();

  const { data: users, error } = await sb
    .from('profiles')
    .select('id, username, reminder_time, reminder_timezone, reminder_email_enabled, joined_at')
    .eq('reminder_email_enabled', true)
    .not('reminder_time', 'is', null);

  if (error) {
    console.error('Supabase fetch error:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }

  if (!users?.length) {
    console.log('No users with reminders enabled');
    return { statusCode: 200, body: JSON.stringify({ sent: 0 }) };
  }

  const results = { email: { sent: 0, failed: 0 } };

  await Promise.allSettled(users.map(async (user) => {
    // Strip seconds from stored time e.g. "13:00:00" -> "13:00"
    const storedTime = (user.reminder_time ?? '').slice(0, 5);
    const userUTC    = localTimeToUTC(storedTime, user.reminder_timezone ?? 'America/New_York');

    // Match within a 7-minute window to account for scheduler drift
    const [uh, um] = userUTC.split(':').map(Number);
    const [ch, cm] = currentUTC.split(':').map(Number);
    const userMins = uh * 60 + um;
    const currMins = ch * 60 + cm;
    if (Math.abs(userMins - currMins) > 7) return;

    const idx     = getTodayIndex(user.joined_at);
    const key     = SCHEDULE[idx];
    const workout = WORKOUT_INFO[key];
    const name    = user.username ?? 'there';

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
          console.log(`Email sent to ${email}`);
        }
      } catch (err) {
        console.error(`Email failed for ${user.id}:`, err.message);
        results.email.failed++;
      }
    }
  }));

  console.log('Reminders:', JSON.stringify(results));
  return { statusCode: 200, body: JSON.stringify(results) };
};
