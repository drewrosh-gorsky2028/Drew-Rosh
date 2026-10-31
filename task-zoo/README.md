# Task Zoo

A cozy task tracker where every task is an animal.

- **Add a task** and an egg hatches into a baby animal in the **Nursery**.
- **Check off subtasks** and it grows: baby → juvenile (⅓ done) → adult (all done). Each stage is bigger and has more detail.
- **Complete the task** and the adult moves into its category's **habitat** in the zoo, where it wanders around. You earn coins too.
- **Overdue tasks** make their animal sleepy (droopy, eyes closed, floating Zzz, a "!" bubble). Animals never die; a bit of progress perks them up.
- **Tap any animal** to see its card: task name, notes, subtasks, due date, hatch date, completion date.
- **Spend coins** in the shop on trees, rocks, ponds, paths, benches, fences and flowers, then drag them into your habitats.

All art is hand-drawn SVG in the code. There are no image files or external assets. Everything is saved in your browser's `localStorage`.

## Run it locally

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
cd task-zoo
npm install
npm run dev        # opens on http://localhost:5173
```

To try it on your phone, run `npm run dev -- --host` and open the "Network" URL it prints. Your phone must be on the same Wi-Fi.

Other scripts:

```bash
npm test           # unit tests (growth, coins, streaks, storage)
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Deploy

The build is a static site in `dist/`. `vite.config.js` uses `base: './'`, so the build works from any URL path.

### Netlify

1. In Netlify, choose **Add new site → Import an existing project** and pick this repo.
2. Set **Base directory** to `task-zoo`. `netlify.toml` already sets the build command (`npm run build`) and the publish folder (`dist`).
3. Deploy.

Or drag the `task-zoo/dist` folder onto <https://app.netlify.com/drop> after running `npm run build`.

### GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` publishes the whole repo: Flappy Dox at `/` and Task Zoo at `/task-zoo/`.

1. In the GitHub repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Go to **Actions → Deploy to GitHub Pages → Run workflow**.
3. Task Zoo will be at `https://<your-username>.github.io/<repo>/task-zoo/`.

To deploy on every push to `main`, uncomment the `push:` lines in the workflow.

> Your data lives in the browser you use. Each device and each domain has its own zoo, so `localhost` and your deployed site don't share data.

## How the code is organized

```
src/
  main.jsx                 entry point
  App.jsx                  layout, which modal is open, phone tabs, celebration
  styles.css               all styling (tokens at the top, responsive rules at the bottom)
  state/
    defaults.js            starting state, storage key
    reducer.js             every change to the data (add/complete tasks, buy/place decor…)
    storage.js             load/save to localStorage and repair older saves
    ZooContext.jsx         React context with useReducer, saves on every change
  lib/
    growth.js              growth stage and overdue rules
    stats.js               animals collected, done this week, streak
    dates.js               local-date helpers
  data/
    sizes.js               size tiers: coin rewards and habitat scale
    zones.js               terrain zones
    decorations.js         shop catalogue (name, price, size)
  components/
    animals/               one drawing per animal, the registry, AnimalSprite wrapper, Egg
    scenery/               zone terrains and decoration drawings
    ui/                    Modal and the icon set
    Header, Nursery, Zoo, Wanderer, TaskList, TaskForm,
    AnimalCard, CategoryManager, Shop, Celebration
```

### Data model (`localStorage["task-zoo:v1"]`)

```js
{
  version: 1,
  coins: 85,
  categories: [{ id, name, zone: 'savanna' | 'arctic' | 'jungle' | 'ocean' }],
  tasks: [{
    id, title, notes,
    size: 'small' | 'medium' | 'large',
    animal: 'panda',               // key in components/animals/index.js
    categoryId,
    dueDate: '2026-11-04' | null,  // local calendar day
    subtasks: [{ id, text, done }],
    createdAt, completedAt,        // ISO timestamps (completedAt is null while growing)
    coinsAwarded,                  // refunded if you send the animal back to the nursery
  }],
  decorations: [{ id, kind: 'tree', habitatId | null, x, y }], // x/y are % of the habitat; null habitatId = in storage
  pastCompletions: ['2026-10-30'], // keeps streak/week stats when a finished task is deleted
}
```

### Add a new animal

1. Draw a component in `components/animals/small.jsx`, `medium.jsx` or `large.jsx`. It gets `stage` (0 baby, 1 juvenile, 2 adult) and `sleepy`. Draw in a 120×120 box with the feet near `y = 112`. Use the helpers in `parts.jsx` (`Eye`, `Blush`, `Smile`, `Tube`, `line`) so it matches the house style. Add detail as `stage` goes up.
2. Register it in `components/animals/index.js` with its size tier.

It then shows up in the animal picker, the nursery and the zoo.

### Add a new decoration

1. Add an entry to `data/decorations.js` (`id`, `name`, `price`, display width `w`).
2. Add the drawing with the same `id` to the `ART` map in `components/scenery/Decorations.jsx`.

### Add a new zone

Add it to `data/zones.js` and add a terrain drawing to `TERRAINS` in `components/scenery/Terrain.jsx`.
