// Shop catalogue. Each `id` must have an SVG in components/scenery/Decorations.jsx.
// `w` is the rendered width in px inside a habitat.
export const DECORATIONS = {
  flowers: { id: 'flowers', name: 'Flower patch', price: 15, w: 44 },
  path: { id: 'path', name: 'Stone path', price: 10, w: 70 },
  rock: { id: 'rock', name: 'Cozy rock', price: 20, w: 52 },
  fence: { id: 'fence', name: 'Picket fence', price: 25, w: 78 },
  bench: { id: 'bench', name: 'Bench', price: 30, w: 66 },
  tree: { id: 'tree', name: 'Shade tree', price: 40, w: 76 },
  pond: { id: 'pond', name: 'Pond', price: 60, w: 96 },
};

export const DECORATION_LIST = Object.values(DECORATIONS);
