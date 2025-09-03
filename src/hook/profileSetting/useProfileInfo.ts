import type { Database } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import { upsertTable } from '@/utils/supabase/upsertTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ProfileBasic } from './useProfileBasic';

type ProfileRow = Database['public']['Tables']['profile']['Row'];
type ProfileInfo = Pick<ProfileRow, 'profile_id' | 'email' | 'nickname' | 'phone'>;

export function useProfileInfo(profileId?: string) {
  return useQuery({
    queryKey: ['profileInfo', profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<ProfileInfo | null> => {
      const { data, error } = await supabase.rpc('get_my_profile');
      if (error) throw error;
      if (!data) return null;

      const { profile_id, email, nickname, phone } = data as ProfileInfo;
      return { profile_id, email, nickname, phone };
    },
    staleTime: 5 * 60 * 1000,
  });
}

export async function isNicknameAvailable(nickname: string, selfId: string) {
  const name = nickname.trim();
  if (!name) return true;

  const { count, error } = await supabase
    .from('profile')
    .select('profile_id', { head: true, count: 'exact' })
    .ilike('nickname', name)
    .neq('profile_id', selfId);

  if (error) throw error;
  return (count ?? 0) === 0;
}

export async function isPhoneAvailable(phoneNumber: string, selfId: string) {
  if (!phoneNumber) return true;

  const { data, error } = await supabase.rpc('is_phone_available', {
    p_phone: phoneNumber,
    p_self: selfId,
  });

  if (error) throw error;
  return !!data;
}

export function useUpdateInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateInfo'],
    mutationFn: async (args: { profileId: string; nickname: string; phone: string }) => {
      const { profileId, nickname, phone } = args;

      const { error } = await upsertTable({
        method: 'upsert',
        tableName: 'profile',
        matchKey: 'profile_id',
        uploadData: {
          profile_id: profileId,
          nickname,
          phone,
          updated_at: new Date().toISOString(),
        },
      });
      if (error) throw error;
      return { profileId, nickname, phone };
    },
    onSuccess: ({ profileId, nickname, phone }) => {
      queryClient.setQueryData<ProfileInfo | null>(['profileInfo', profileId], (prev) =>
        prev ? { ...prev, nickname, phone } : prev
      );
      queryClient.invalidateQueries({ queryKey: ['profileInfo', profileId] });

      queryClient.setQueryData<ProfileBasic | null>(['profileBasic', profileId], (prev) =>
        prev ? { ...prev, nickname } : prev
      );
      queryClient.invalidateQueries({ queryKey: ['profileBasic', profileId] });
    },
  });
}
