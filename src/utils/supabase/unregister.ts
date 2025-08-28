import supabase from '@/supabase/supabase';

export async function unregister() {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes.user) {
    throw new Error('로그인이 필요한 서비스입니다.');
  }

  const email = userRes.user.email;
  if (!email) {
    throw new Error('메일 주소를 불러오는 데 실패했습니다.');
  }

  try {
    const { error: UnregisterErr } = await supabase.functions.invoke('delete-user', {
      method: 'POST',
      body: {},
    });
    if (UnregisterErr) throw new Error(UnregisterErr.message);
  } catch (err) {
    throw new Error('delete-user invoke failed');
  }

  await supabase.auth.signOut();
  return true;
}
