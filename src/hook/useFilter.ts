import wines from '@/data/data.json';

export const filtered = (keyword: string) => {
  const k = keyword.toLowerCase().trim();

  return wines.filter((wine) => {
    const title = wine.title.toLowerCase();
    const region = wine.region
      .map((a) => a)
      .join('')
      .toLowerCase();
    const grapes = wine.grapes
      .map((a) => a)
      .join('')
      .toLowerCase();
    const countries = wine.country.toLowerCase();
    const contents = wine.wine_description.toLowerCase();
    const foods = wine.food
      .map((a) => a)
      .join('')
      .toLowerCase();
    const scent = wine.scent
      .map((a) => a)
      .join('')
      .toLowerCase();

    return (
      region.includes(k) ||
      title.includes(k) ||
      grapes.includes(k) ||
      countries.includes(k) ||
      contents.includes(k) ||
      foods.includes(k) ||
      scent.includes(k)
    );
  });
};
