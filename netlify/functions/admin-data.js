const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Missing auth token' }) };
  }

  const token = authHeader.slice(7);
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid session' }) };
  }

  const { data: reqProfile } = await sb.from('profiles').select('role').eq('id', user.id).single();
  if (reqProfile?.role !== 'admin') {
    return { statusCode: 403, body: JSON.stringify({ error: 'Access denied' }) };
  }

  const [
    authUsers,
    profiles,
    workoutLogs,
    cancellations,
    userLibrary,
    videoProgress,
  ] = await Promise.all([
    sb.auth.admin.listUsers({ perPage: 1000 }),
    sb.from('profiles').select('*'),
    sb.from('workout_logs').select('user_id, logged_at'),
    sb.from('cancellation_reasons').select('reason, created_at').order('created_at', { ascending: false }),
    sb.from('user_library').select('user_id, course_id, status'),
    sb.from('video_progress').select('user_id, course_id'),
  ]);

  if (authUsers.error) {
    return { statusCode: 500, body: JSON.stringify({ error: authUsers.error.message }) };
  }

  const profileMap = {};
  (profiles.data || []).forEach(p => { profileMap[p.id] = p; });

  // Build members list
  const members = (authUsers.data.users || []).map(u => ({
    id:                     u.id,
    email:                  u.email,
    created_at:             u.created_at,
    username:               profileMap[u.id]?.username || '—',
    role:                   profileMap[u.id]?.role || 'member',
    subscription:           profileMap[u.id]?.subscription || 'free',
    fitness_level:          profileMap[u.id]?.fitness_level || '—',
    primary_goal:           profileMap[u.id]?.primary_goal || '—',
    reminder_email_enabled: profileMap[u.id]?.reminder_email_enabled || false,
    reminder_sms_enabled:   profileMap[u.id]?.reminder_sms_enabled || false,
    phone_verified:         profileMap[u.id]?.phone_verified || false,
  })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Workout logs per user
  const logsPerUser = {};
  (workoutLogs.data || []).forEach(l => {
    logsPerUser[l.user_id] = (logsPerUser[l.user_id] || 0) + 1;
  });

  // Course saves per user
  const coursesPerUser = {};
  (userLibrary.data || []).forEach(l => {
    coursesPerUser[l.user_id] = (coursesPerUser[l.user_id] || 0) + 1;
  });

  // Videos watched per user
  const videosPerUser = {};
  (videoProgress.data || []).forEach(v => {
    videosPerUser[v.user_id] = (videosPerUser[v.user_id] || 0) + 1;
  });

  // Cancellation reason counts
  const reasonCounts = {};
  (cancellations.data || []).forEach(c => {
    reasonCounts[c.reason] = (reasonCounts[c.reason] || 0) + 1;
  });

  // Stats
  const totalMembers   = members.length;
  const premiumMembers = members.filter(m => m.subscription === 'premium' || m.subscription === 'canceling').length;
  const emailReminders = members.filter(m => m.reminder_email_enabled).length;
  const smsReminders   = members.filter(m => m.reminder_sms_enabled).length;
  const totalLogs      = (workoutLogs.data || []).length;
  const totalCancels   = (cancellations.data || []).length;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      members,
      logsPerUser,
      coursesPerUser,
      videosPerUser,
      cancellations: cancellations.data || [],
      reasonCounts,
      stats: {
        totalMembers,
        premiumMembers,
        freeMembers: totalMembers - premiumMembers,
        emailReminders,
        smsReminders,
        totalLogs,
        totalCancels,
      },
    }),
  };
};
