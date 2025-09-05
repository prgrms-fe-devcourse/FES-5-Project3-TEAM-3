/// <reference types="https://jsr.io/@supabase/functions-js/edge-runtime.d.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOW_ORIGIN = '*';
const cors = {
  'Access-Control-Allow-Origin': ALLOW_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-fn-key',
};

function isValidPhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('02')) {
    return digits.length >= 9 && digits.length <= 10 ? digits : null;
  }
  return /^0\d{9,10}$/.test(digits) ? digits : null;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***';
  const l = local.length;
  const localMasked =
    l <= 2
      ? local[0] + '*'.repeat(Math.max(l - 1, 1))
      : local.slice(0, 1) + '*'.repeat(l - 2) + local.slice(-1);
  const [host, ...rest] = domain.split('.');
  const h = host.length;
  const hostMasked =
    h <= 2
      ? host[0] + '*'.repeat(Math.max(h - 1, 1))
      : host.slice(0, 1) + '*'.repeat(h - 2) + host.slice(-1);
  return `${localMasked}@${hostMasked}.${rest.join('.')}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }

  // 🔐 함수 키 검사
  const fnKey = req.headers.get('x-fn-key');
  const expected = Deno.env.get('FIND_EMAIL_API_KEY') ?? '';
  if (!expected || fnKey !== expected) {
    return new Response(JSON.stringify({ ok: true, found: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }

  try {
    const { phone } = await req.json().catch(() => ({}));
    const normalized = typeof phone === 'string' ? isValidPhone(phone.trim()) : null;
    if (!normalized) {
      return new Response(JSON.stringify({ ok: true, found: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const url = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await admin
      .from('profile') // 테이블명/컬럼명 확인
      .select('email, phone')
      .eq('phone', normalized)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data?.email) {
      return new Response(JSON.stringify({ ok: true, found: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        found: true,
        email_masked: maskEmail(data.email),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...cors } }
    );
  } catch {
    return new Response(JSON.stringify({ ok: true, found: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }
});
