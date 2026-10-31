// Animal registry. To add an animal: draw a component in one of the tier
// files (it receives `stage` 0|1|2 and `sleepy`), then list it here.
import { Bunny, Duck, Hedgehog, Penguin } from './small.jsx';
import { Flamingo, Giraffe, Kangaroo, Panda } from './medium.jsx';
import { Elephant, PolarBear, Rhino, Whale } from './large.jsx';

export const ANIMALS = {
  bunny: { id: 'bunny', name: 'Bunny', size: 'small', Draw: Bunny },
  penguin: { id: 'penguin', name: 'Penguin', size: 'small', Draw: Penguin },
  hedgehog: { id: 'hedgehog', name: 'Hedgehog', size: 'small', Draw: Hedgehog },
  duck: { id: 'duck', name: 'Duck', size: 'small', Draw: Duck },
  panda: { id: 'panda', name: 'Panda', size: 'medium', Draw: Panda },
  giraffe: { id: 'giraffe', name: 'Giraffe', size: 'medium', Draw: Giraffe },
  kangaroo: { id: 'kangaroo', name: 'Kangaroo', size: 'medium', Draw: Kangaroo },
  flamingo: { id: 'flamingo', name: 'Flamingo', size: 'medium', Draw: Flamingo },
  elephant: { id: 'elephant', name: 'Elephant', size: 'large', Draw: Elephant },
  whale: { id: 'whale', name: 'Whale', size: 'large', Draw: Whale },
  rhino: { id: 'rhino', name: 'Rhino', size: 'large', Draw: Rhino },
  polarbear: { id: 'polarbear', name: 'Polar bear', size: 'large', Draw: PolarBear },
};

export const ANIMAL_LIST = Object.values(ANIMALS);

export function animalsForSize(size) {
  return ANIMAL_LIST.filter((a) => a.size === size);
}
