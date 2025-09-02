import type { Database } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';

type Method = 'insert' | 'update' | 'upsert';
type Tables = Database['public']['Tables'];
type TableName = keyof Tables & string;
type RowFor<T extends TableName> = Tables[T]['Row'];
type InsertFor<T extends TableName> = Tables[T]['Insert'];
type UpdateFor<T extends TableName> = Tables[T]['Update'];
type FilterValue = string | number | boolean | null | string[] | number[];
type FilterableCols<T> = {
  [K in keyof T]: T[K] extends FilterValue ? K : never;
}[keyof T];

export async function upsertTable<T extends TableName, K extends FilterableCols<RowFor<T>>>(args: {
  method?: Method;
  tableName: T;
  uploadData: any;
  matchKey?: K;
}): Promise<{ result: RowFor<T>[] | null; error: unknown }> {
  const { method = 'upsert', tableName, uploadData, matchKey } = args;

  const query = supabase.from(tableName as TableName);

  // 신규 데이터 추가(insert)
  if (method === 'insert') {
    const { data: result, error } = await query.insert(uploadData as InsertFor<T>);
    return { result, error };
  }

  // 기존 데이터 수정(update)
  if (method === 'update') {
    if (!matchKey || !uploadData[matchKey]) {
      throw new Error(
        'update 시에는 matchKey(예: user_id)가 필요하며, 해당 데이터의 값이 uploadData에 포함되어 있어야 합니다.'
      );
    }

    const { [matchKey]: matchValue, ...rest } = uploadData as UpdateFor<T> &
      Record<K, RowFor<T>[K]>;
    const { data: result, error } = await query
      .update(rest as UpdateFor<T>)
      .eq(matchKey as string, matchValue as Record<K, RowFor<T>[K]>);

    return { result, error };
  }

  // 기존 데이터가 있으면 update, 없으면 insert(upsert)
  if (method === 'upsert') {
    if (!matchKey || !uploadData[matchKey]) {
      throw new Error(
        'upsert 시에는 matchKey(예: user_id)가 필요하며, 해당 데이터의 값이 uploadData에 포함되어 있어야 합니다.'
      );
    }

    const matchValue = uploadData[matchKey] as RowFor<T>[K];

    // 기존 데이터 조회
    const { error: fetchError, count } = await query
      .select(`${matchKey as string}`, { head: true, count: 'exact' })
      .eq(matchKey as string, matchValue as Record<K, RowFor<T>[K]>);

    if (fetchError && fetchError.code !== 'PGRST116') {
      return { result: null, error: fetchError };
    }

    if ((count ?? 0) > 0) {
      const { [matchKey]: _, ...rest } = uploadData as UpdateFor<T>;
      const { data: result, error } = await query
        .update(rest as UpdateFor<T>)
        .eq(matchKey as string, matchValue as Record<K, RowFor<T>[K]>);
      return { result, error };
    } else {
      const { data: result, error } = await query.insert(uploadData as InsertFor<T>);
      return { result, error };
    }
  }

  throw new Error('method는 insert, update, upsert 중 하나여야 합니다.');
}
