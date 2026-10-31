export function uid(prefix = 'id') {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

export function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}
