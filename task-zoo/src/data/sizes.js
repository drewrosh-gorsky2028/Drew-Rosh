// Task size tiers. `scale` sizes the animal in habitats; `coins` is the reward.
export const SIZES = {
  small: { id: 'small', name: 'Small', hint: 'quick win', coins: 10, scale: 0.8 },
  medium: { id: 'medium', name: 'Medium', hint: 'a few steps', coins: 25, scale: 1 },
  large: { id: 'large', name: 'Large', hint: 'big project', coins: 50, scale: 1.3 },
};

export const SIZE_LIST = Object.values(SIZES);
