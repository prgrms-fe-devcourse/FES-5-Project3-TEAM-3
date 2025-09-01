export const computeTaste = (
  taste:
    | number
    | {
        sweetness: number | null;
        acidic: number | null;
        tannic: number | null;
        body: number | null;
      }
    | null
) => {
  if (typeof taste === 'number' || taste === null)
    return taste === null ? null : Math.ceil(taste * 0.05);
  return Object.fromEntries(
    Object.entries(taste).map(([k, v]) => {
      return v === null ? [k, null] : [k, Math.ceil(v * 0.05)];
    })
  ) as typeof taste;
};
