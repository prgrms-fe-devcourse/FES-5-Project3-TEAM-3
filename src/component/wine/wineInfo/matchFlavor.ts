// 임시 flavor 분류 함수 ㅠㅠ

/* prettier-ignore*/
const fruit = ['lemon', 'lime', 'grapefruit', 'citrus', 'orange', 'apricot', 'peach', 'green apple', "apple", 'pear', 'gooseberry', "stone fruit", "prune", "fig", "dried fruit", "raisin", "mamalade"];
/* prettier-ignore*/
const tropical = ['pineapple', 'papaya', 'passion fruit', "mango", "pineapple", "tropical", "kiwi", "lychee"];
/* prettier-ignore*/
const redBerry = ['strawberry', 'cherry', 'raspberry , pomegranate', "red fruit", "cranberry", "red plum", "red currant"];
/* prettier-ignore*/
const blackBerry = ['blackberry', 'black cherry', 'blackcurrant',  'plum', "black fruit", "dark fruit", "cassis", "blueberry"];
/* prettier-ignore*/
const herb = ['rosemary', 'sage', 'thyme',"green herbs"];
/* prettier-ignore*/
const plant = ['bell pepper', 'asparagus', 'green pepper', 'jalapeño', 'grass'];
/* prettier-ignore*/
const earthy = ["dirt", "forest floor", "mushroom", "truffle", "flint", "minerals", "slate", "smoke", "oak", "stone", "vanilla", "tobacco", "leather", "earthy", "chalky", "chocolate"]
/* prettier-ignore*/
const spice = ["salt", "balsamic","pepper", "licorice", "cinnamon", "savory", "eucalyptus", "mentol", "mint", "black pepper", "clove"]
/* prettier-ignore*/
const aging = ["honey", "caramel", "butter", "cream", "yeast", "cheese"]
/* prettier-ignore*/
const flower = ["violet", "flower", "dried flowers", "lavender", "lilac", "perfume", "honeysuckle", "rose"]

/* prettier-ignore*/
const flavorCategories = {fruit, tropical, redBerry, blackBerry, herb, plant, earthy, spice, aging, flower}

export function matchFlavor(flavor: string) {
  flavor = flavor.toLowerCase();
  return Object.entries(flavorCategories).find(([_, arr]) => arr.includes(flavor))?.[0] || 'others';
}
