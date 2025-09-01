import type { Database } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import { upsertTable } from '@/utils/supabase/upsertTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type ProfileRow = Database['public']['Tables']['profile']['Row'];
export type ProfileBasic = Pick<ProfileRow, 'profile_id' | 'nickname' | 'profile_image_url'>;

export function useProfile(profileId?: string) {
  return useQuery({
    queryKey: ['profileBasic', profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<ProfileBasic | null> => {
      const { data, error } = await supabase
        .from('profile')
        .select('profile_id, nickname, profile_image_url')
        .eq('profile_id', profileId as string)
        .maybeSingle();

      if (error) throw error;
      return (data as ProfileBasic) ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateAvatar'],
    mutationFn: async ({ profileId, publicUrl }: { profileId: string; publicUrl: string }) => {
      if (!profileId) throw new Error('Profile 정보가 없습니다.');
      const { error } = await upsertTable({
        method: 'upsert',
        tableName: 'profile',
        matchKey: 'profile_id',
        uploadData: {
          profile_id: profileId,
          profile_image_url: publicUrl,
          updated_at: new Date().toISOString(),
        },
      });
      if (error) throw error;
      return { profileId, publicUrl };
    },
    onSuccess: ({ profileId, publicUrl }) => {
      queryClient.setQueryData<ProfileBasic | null>(['profileBasic', profileId], (prev) =>
        prev ? { ...prev, profile_image_url: publicUrl } : prev
      );
      queryClient.invalidateQueries({ queryKey: ['profileBasic', profileId] });
    },
  });
}
