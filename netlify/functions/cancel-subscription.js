const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Missing auth token' }) };
  }

  const token = authHeader.slice(7);
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Verify user
  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid session' }) };
  }

  // Get profile
  const { data: profile } = await sb
    .from('profiles')
    .select('subscription, stripe_subscription_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_subscription_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No active subscription found' }) };
  }

  if (profile?.subscription !== 'premium') {
    return { statusCode: 400, body: JSON.stringify({ error: 'No active subscription to cancel' }) };
  }

  const { reason, details } = JSON.parse(event.body || '{}');

  try {
    // Cancel at period end — user keeps access until billing cycle ends
    const subscription = await stripe.subscriptions.update(
      profile.stripe_subscription_id,
      { cancel_at_period_end: true }
    );

    // Store cancellation reason
    if (reason) {
      await sb.from('cancellation_reasons').insert({
        user_id:          user.id,
        reason,
        details:          details || null,
        cancel_at:        new Date(subscription.current_period_end * 1000).toISOString(),
      })
    }

    // Mark subscription as canceling (still premium until period end)
    await sb.from('profiles').update({
      subscription: 'canceling',
    }).eq('id', user.id);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        cancelAt: new Date(subscription.current_period_end * 1000).toISOString(),
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
