import supabase from '@/supabase/supabase';

export type ChangePasswordParams = {
  current: string;
  next: string;
};

export async function changePassword({ current, next }: ChangePasswordParams) {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes.user) {
    throw new Error('로그인이 필요한 서비스입니다.');
  }

  const email = userRes.user.email;
  if (!email) {
    throw new Error('메일 주소를 불러오는 데 실패했습니다.');
  }

  const { error: signinErr } = await supabase.auth.signInWithPassword({
    email,
    password: current,
  });

  if (signinErr) throw new Error('현재 비밀번호가 올바르지 않습니다.');

  const { error: updateErr } = await supabase.auth.updateUser({ password: next });
  if (updateErr) throw new Error(`비밀번호 변경에 실패했습니다. Error:${updateErr.message}`);

  return true;
}
