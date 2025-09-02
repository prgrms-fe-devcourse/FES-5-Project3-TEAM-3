import type { Tables } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import { useEffect, useState } from 'react';

type Food = Tables<'pairings'>
type Wines = Tables<'wines'>

export const filtered = (keyword: string) => {

  const k = keyword.toLowerCase().trim();
  const [wines, setWines] = useState<Wines[]>([]);

  useEffect(() => {
    const fetchData = async() => {
      const { data, error } = await supabase.from('wines').select('*')

      if(error) console.log(error)
      if (data) setWines(data)
    }
    fetchData()
  },[keyword])

  console.log(wines)

  return wines.filter((wine) => {
  
    const title = wine.name.toLowerCase();
    const titleKo = wine.name_ko?.toLowerCase()

    const country = wine.country?.toLowerCase();
    const countryKo = wine.country_ko?.toLowerCase()


    const grapes = wine.variety
      .map((a) => a)
      .join('')
      .toLowerCase();
    const grapesKo = wine.variety_ko?.map((a)=>a).join('').toLowerCase();
    
     const category = wine.category?.toLowerCase();
     const categoryKo = wine.category_ko?.toLowerCase();
    
    const contents = wine.description_ko?.toLowerCase();


    const scent = wine.representative_flavor?.map((a) => a)
      .join('')
      .toLowerCase();
    const scentKo = wine.representative_flavor_ko?.map((a) => a).join('').toLowerCase()
   
    const pronunciations = JSON.stringify(wine.pronunciations).toLowerCase()
    
    return (
      country && country.includes(k) ||
      title.includes(k) ||
      grapes.includes(k) ||
      contents && contents.includes(k) ||
     
      scent && scent.includes(k) ||
      category?.includes(k) || titleKo?.includes(k) ||  countryKo?.includes(k) || grapesKo?.includes(k) || categoryKo?.includes(k) || scentKo?.includes(k) || pronunciations.includes(k) 
    );
  });
};
