# To Zoo List

A simple to-do list where every task has an animal.

- Type a task and press **Add**. A random baby animal appears next to it.
- Tap the circle to finish it. The animal grows up and the task moves to **Done**.
- Tap the circle again to undo, or **×** to delete.

Your list is saved in your browser's `localStorage`. All animals are hand-drawn SVG in the code, with no image files.

We're building this piece by piece. Subtasks, a zoo view, coins and decorations were in an earlier version and can come back one at a time (see git history).

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
npm test           # unit tests
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

The workflow at `.github/workflows/deploy-pages.yml` publishes the whole repo: Flappy Dox at `/` and To Zoo List at `/task-zoo/`.

1. In the GitHub repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Go to **Actions → Deploy to GitHub Pages → Run workflow**.
3. To Zoo List will be at `https://<your-username>.github.io/<repo>/task-zoo/`.

To deploy on every push to `main`, uncomment the `push:` lines in the workflow.

> Your data lives in the browser you use. Each device and each domain has its own zoo, so `localhost` and your deployed site don't share data.

## How the code is organized

```
src/
  main.jsx                 entry point
  App.jsx                  the whole screen: add form, task list, done list
  styles.css               all styling
  lib/tasks.js             create / finish / delete tasks, load and save
  lib/id.js                ids and random picks
  components/animals/      one drawing per animal, the registry (index.js), AnimalSprite
```

Saved data (`localStorage["to-zoo-list:v1"]`):

```js
{ version: 1, tasks: [{ id, title, animal: 'panda', createdAt, completedAt /* null until done */ }] }
```

### Add a new animal

1. Draw a component in `components/animals/small.jsx`, `medium.jsx` or `large.jsx`. It gets `stage` (0 baby, 2 grown-up). Draw in a 120×120 box with the feet near `y = 112`, using the helpers in `parts.jsx` (`Eye`, `Blush`, `Smile`, `Tube`, `line`).
2. Register it in `components/animals/index.js`.
