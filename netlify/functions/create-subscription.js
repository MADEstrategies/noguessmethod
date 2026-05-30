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
 
  const { data: { user }, error: authError } = await sb.auth.getUser(token);
  if (authError || !user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid session' }) };
  }
 
  const { data: profile } = await sb
    .from('profiles')
    .select('subscription, stripe_customer_id')
    .eq('id', user.id)
    .single();
 
  if (profile?.subscription === 'premium') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Already subscribed' }) };
  }
 
  const { paymentMethodId, name, couponId } = JSON.parse(event.body);
 
  try {
    // Get or create Stripe customer
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
        metadata: { userId: user.id },
      });
      customerId = customer.id;
    } else {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }
 
    // Build subscription params
    const subParams = {
      customer: customerId,
      items: [{ price: process.env.STRIPE_PRICE_ID }],
      metadata: { userId: user.id },
      expand: ['latest_invoice.payment_intent'],
    };
    if (couponId) subParams.coupon = couponId;
 
    const subscription = await stripe.subscriptions.create(subParams);
 
    const paymentIntent = subscription.latest_invoice?.payment_intent;
    if (paymentIntent && paymentIntent.status === 'requires_action') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requiresAction: true,
          clientSecret: paymentIntent.client_secret,
        }),
      };
    }
 
    // Update Supabase profile
    await sb.from('profiles').update({
      subscription: 'premium',
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
    }).eq('id', user.id);
 
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
