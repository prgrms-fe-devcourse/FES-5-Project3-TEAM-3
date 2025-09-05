export async function findEmailByPhone(phone: string) {
  const base = import.meta.env.VITE_SUPABASE_FUNCTION_URL;
  if (!base) throw new Error('Missing VITE URL');

  const res = await fetch(`${base}/find-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-fn-key': import.meta.env.VITE_FN_KEY,
    },
    body: JSON.stringify({ phone }),
  });

  if (!res.ok) {
    throw new Error(`find-email failed: ${res.status}`);
  }

  const data = await res.json();
  return data as {
    ok: boolean;
    found: boolean;
    email_masked?: string;
  };
}
