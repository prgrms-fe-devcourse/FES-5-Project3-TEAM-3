import type { Tables } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import { useEffect,useState } from 'react';


type Wines = Tables<'wines'>;

type Food = Pick<Tables<'pairings'>,'pairing_category' | 'pairing_name' >& {
  wines: Pick<Tables<'wines'>,'wine_id'|'image_url'|'name'|'description_ko'>
}

type hash = Tables<'hashtags'> & {
  wines: Pick<Tables<'wines'>, 'wine_id' | 'image_url' | 'name' | 'description_ko'> | null
};

export const filtered = (keyword: string) => {
  const k = keyword.toLowerCase().trim();
  const [wines, setWines] = useState<Wines[]>([]);
  const [foods,setFoods] = useState<Food[]>([])
  const [hash, setHash] = useState<hash[]>([])
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('wines').select('*');
      if (error) console.log(error);
      if (data) setWines(data);
    };
    fetchData();
  }, [keyword]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('pairings').select('pairing_category, pairing_name, wines(wine_id,image_url,name,description_ko)')
      if (error) console.log(error)
      if (data) setFoods(data)
    }
    fetchData()
  }, [keyword])

  useEffect(() => {
    const fetchData = async () => {
      const {data,error} =await supabase.from('hashtags').select('*,wines(wine_id,image_url,name,description_ko)')
      if(error) console.log(error)
      if(data) setHash(data)
    }
    fetchData()
  },[keyword])



  const matchTags = hash.filter((a) => a.tag_text.includes(k)).map((a) => a.wines)

  console.log(matchTags)

  const pairingCategory = foods.filter((a) => a.pairing_category?.toLowerCase().includes(k)).map((a) => a.wines)

  const pairingName = foods.filter((a) => a.pairing_name.toLowerCase ().includes(k)).map((a)=>a.wines)
 
  return wines.filter((wine) => {
  
    const title = wine.name.toLowerCase()
    const titleKo = wine.name_ko?.toLowerCase();

    const country = wine.country?.toLowerCase();
    const countryKo = wine.country_ko?.toLowerCase();

    const grapes = wine.variety
      .map((a) => a)
      .join('')
      .toLowerCase();
    const grapesKo = wine.variety_ko
      ?.map((a) => a)
      .join('')
      .toLowerCase();

    const category = wine.category?.toLowerCase();
    const categoryKo = wine.category_ko?.toLowerCase();

    const contents = wine.description_ko?.toLowerCase();

    const scent = wine.representative_flavor
      ?.map((a) => a)
      .join('')
      .toLowerCase();
    const scentKo = wine.representative_flavor_ko
      ?.map((a) => a)
      .join('')
      .toLowerCase();

    const pronunciations = JSON.stringify(wine.pronunciations).toLowerCase();

    return (
      matchTags.some((a) =>a?.wine_id == wine.wine_id) ||
      pairingName.some((a) => a.wine_id == wine.wine_id) ||
      pairingCategory.some((a) => a.wine_id === wine.wine_id) ||
      (country && country.includes(k)) ||
      title.includes(k) ||
      grapes.includes(k) ||
      (contents && contents.includes(k)) ||
      (scent && scent.includes(k)) ||
      category?.includes(k) ||
      titleKo?.includes(k) ||
      countryKo?.includes(k) ||
      grapesKo?.includes(k) ||
      categoryKo?.includes(k) ||
      scentKo?.includes(k) ||
      pronunciations.includes(k) ||
      category?.includes(k)
    );
  });
};
