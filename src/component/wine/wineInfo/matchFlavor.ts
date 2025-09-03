// 임시 flavor 분류 함수 ㅠㅠ

/* prettier-ignore*/

const citrus = ['lemon','lime','citrus','orange','grapefruit','clementine, blood orange','orange peel']

const apple = ['green apple', 'pear', 'apple'];

const grape = ['grape', 'whire grape', 'green grape', 'red grape'];

/* prettier-ignore*/
const tropical = ['pineapple', 'papaya', 'passion fruit', "mango", "pineapple", "tropical", "kiwi", "lychee", 'star fruit', 'tamarind', 'banana', 'coconut'];

const stoneFruit = ['peach', 'apricot', 'necarine', 'plum', 'stone fruit'];

const driedfruit = [
  'fig',
  'dried fruit',
  'raisin',
  'prune',
  'golden raisin',
  'dried fig',
  'dried date',
  'dried apricot',
];

/* prettier-ignore*/
const redBerry = ['strawberry', 'cherry', 'black cherry', 'raspberry' , 'pomegranate', "red fruit", "cranberry", "red plum", "red currant"];

/* prettier-ignore*/
const blackBerry = ['blackberry','gooseberry','currant', 'blackcurrant',"black fruit", "dark fruit", "cassis", "blueberry"];

const chocolate = ['dark chocolate', 'milk chocolate', 'chocolate', 'white chocolate', 'cocoa'];

/* prettier-ignore*/
const herb = [
  'rosemary',
  'sage',
  'thyme',
  'green herbs',
  'bergamot',
  'hops',
  'black tea',
  'mint',
  'green tea',
  'sage',
  'dill',
  'grassy',
  'eucalyptus',
  'lavender',
  'lemongrass',
];

const sweet = [
  'vanilla',
  'mazipan',
  'nougat',
  'honey',
  'cream',
  'marshmallow',
  'cane sugar',
  'syrup',
  'brown sugar',
  'caramel',
  'maple syrup',
  'molasses',
  'mamalade',
];

const nut = ['almond', 'hazelnut', 'pecan', 'cashewnut', 'peanut', 'walnut', 'nutty'];

const dessert = ['flint', 'brioche', 'cracker', 'toast'];

/* prettier-ignore*/
const plant = [
  'bell pepper',
  'asparagus',
  'green pepper',
  'jalapeño',
  'grass',
  'mushroom',
  'truffle',
,'tomato'];
/* prettier-ignore*/

const earthy = ["dirt", "forest floor", "minerals", "slate", "smoke", "oak", "stone", "tobacco", "leather", "earthy", "chalky"]

/* prettier-ignore*/
const spice = [
  'salt',
  'balsamic',
  'pepper',
  'licorice',
  'cinnamon',
  'savory',
  'anise',
  'cumin',
  'nutmag',
  'ginger',
  'coriander',
  'mentol',
  'black pepper',
  'clove',
  'white pepper',
  'oil',
];

/* prettier-ignore*/
const aging = ["yeast", "cheese",'butter']

/* prettier-ignore*/
const flower = ["violet", "flower", "dried flowers",  "lilac", "perfume", "honeysuckle", "rose", ,'orange blossom','jasmine','honeysuckle','magnolia','hibiscus','elderflower','chamomile','rose petal']

/* prettier-ignore*/
const flavorCategories = {citrus,apple,grape,driedfruit,stoneFruit, tropical, redBerry, blackBerry,sweet,dessert, nut, herb, plant,chocolate, earthy, spice, aging, flower}

export function matchFlavor(flavor: string) {
  flavor = flavor.toLowerCase();
  return Object.entries(flavorCategories).find(([_, arr]) => arr.includes(flavor))?.[0] || 'others';
}
