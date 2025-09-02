import supabase from '@/supabase/supabase';
import { upsertTable } from '@/utils/supabase/upsertTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type ProfileBio = { profile_id: string; bio: string | null };

export function useProfileBio(profileId?: string) {
  return useQuery({
    queryKey: ['profileBio', profileId],
    enabled: !!profileId,
    queryFn: async (): Promise<ProfileBio | null> => {
      const { data, error } = await supabase
        .from('profile')
        .select('profile_id, bio')
        .eq('profile_id', profileId as string)
        .maybeSingle();

      if (error) throw error;
      return (data as ProfileBio) ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateBio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateBio'],
    mutationFn: async ({ profileId, bio }: { profileId: string; bio: string }) => {
      if (!profileId) throw new Error('Profile 정보가 없습니다.');
      const { error } = await upsertTable({
        method: 'upsert',
        tableName: 'profile',
        matchKey: 'profile_id',
        uploadData: {
          profile_id: profileId,
          bio,
          updated_at: new Date().toISOString(),
        },
      });
      if (error) throw error;
      return { profileId, bio };
    },
    onSuccess: ({ profileId, bio }) => {
      queryClient.setQueryData<ProfileBio | null>(['profileBio', profileId], (prev) =>
        prev ? { ...prev, bio } : prev
      );
      queryClient.invalidateQueries({ queryKey: ['profileBio', profileId] });
    },
  });
}
