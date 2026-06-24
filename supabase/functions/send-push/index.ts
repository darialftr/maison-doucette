import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY') || '';
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') || '';
const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:maisondoucette.dd@gmail.com';
const webhookSecret = Deno.env.get('WEBHOOK_SECRET') || '';

webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

const supabase = createClient(supabaseUrl, serviceRoleKey);

function notificationFromPayload(payload: any) {
  const record = payload?.record || payload?.new || payload || {};
  const table = payload?.table || payload?.type || '';

  if (table === 'orders' || record.customer_name || record.total) {
    return {
      title: 'Comandă nouă Maison Doucette',
      body: `${record.customer_name || 'Client nou'} • ${record.total ? record.total + ' RON' : 'verifică adminul'}`,
      url: '/admin.html#orders',
    };
  }

  if (table === 'notifications' || record.title || record.message) {
    return {
      title: record.title || 'Notificare Maison Doucette',
      body: record.message || 'Ai o notificare nouă.',
      url: '/admin.html#notifications',
    };
  }

  if (payload?.event === 'admin_login') {
    return {
      title: 'Login în admin',
      body: payload.email ? `${payload.email} s-a logat în admin.` : 'Cineva s-a logat în admin.',
      url: '/admin.html',
    };
  }

  return {
    title: 'Maison Doucette',
    body: 'Ai o notificare nouă.',
    url: '/admin.html',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const fromWebhook = req.headers.get('x-webhook-secret') === webhookSecret;
  const fromLoggedAdmin = Boolean(req.headers.get('authorization'));

  if (!fromWebhook && !fromLoggedAdmin) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const payload = await req.json().catch(() => ({}));
  const notification = notificationFromPayload(payload);

  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('id, subscription');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const results = await Promise.allSettled(
    (subscriptions || []).map(async (row) => {
      try {
        await webpush.sendNotification(row.subscription, JSON.stringify(notification));
        return { id: row.id, ok: true };
      } catch (error: any) {
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('id', row.id);
        }
        return { id: row.id, ok: false, error: error?.message };
      }
    })
  );

  return new Response(JSON.stringify({ 
  sent: results.length, 
  results 
}, null, 2), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});
});
