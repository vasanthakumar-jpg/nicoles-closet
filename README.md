# Nicole’s Closet — Image-only interactive documentary

A React, TypeScript, Vite, Tailwind CSS, and Motion experience using the exact uploaded artwork.

## Local preview

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite, normally http://127.0.0.1:5173/.

## Journey

The supplied door-opening video starts immediately, with muted inline autoplay and no loading screen. When the video ends, it fades into the original atrium image. A subtle Skip Intro control is available. If a browser blocks autoplay, a small Play control appears; if the video cannot load, the atrium is shown directly.

The atrium has eight image-relative clickable regions: IT Division, Design Section, Jack Duke, CL California, Nicole’s Closet, Nicole Duke, Just Nikki, and Nicole’s Place. Every region opens a full-screen visual chapter with one Back control. Just Nikki plays `public/media/JustNikki.mp4` with muted autoplay, inline playback, and native playback/sound controls. The hotspot zooms toward the section before the chapter fades and scales into view; Back returns smoothly to the atrium. Escape returns to the atrium. Browser Back and Forward work between chapters and the atrium.

There are no headers, footers, text panels, menus, descriptions, or added copy on the images. Text embedded in the uploaded artwork remains part of the original image.

## Replace chapter media

All eight entries are configured in `src/data/sections.ts`. Just Nikki uses the supplied video. The other current placeholders are CSS views of the corresponding regions of the original atrium. No reference file is edited or regenerated.

For an independent image, replace the section’s media object:

```ts
media: { type: 'image', src: `${import.meta.env.BASE_URL}media/jack-duke.jpg` }
```

For a video, place the file under `public/media` and use:

```ts
media: {
  type: 'video',
  src: `${import.meta.env.BASE_URL}media/jack-duke.mp4`,
  poster: `${import.meta.env.BASE_URL}media/jack-duke.jpg`,
}
```

Omit `focus` for independent images/videos. Videos start muted when their chapter opens and provide native playback and sound controls. For cropped placeholders, `focus` is `[left, top, width, height]` in percentages of the original atrium. Each section owns one media container.

The homepage source is `public/media/Nicole’s Fashion Empire Atrium.png`. The intro video is `public/media/Woman_and_girl_opening_door_20261024114408.mp4`; `founder.jpeg` is its poster while the first video frame becomes available. The atrium image preloads in the background without delaying the intro. Image fitting preserves aspect ratio and keeps the full atrium visible on desktop, tablet, and mobile. Hotspots use the actual displayed image bounds, including letterboxing.

## Build and checks

```sh
npm run build
npm run test:e2e
```

The production static site is in `dist/`. Browser checks use installed Google Chrome and cover video autoplay and completion, skip, all eight hotspots, return navigation, history, keyboard access, mobile coordinates, image-only content, and reduced motion.



## GitHub Pages deployment

Production builds use `/nicoles-closet/`; local development keeps `/`. Runtime media URLs use Vite’s `BASE_URL`, and HTML favicon/preload links use repository-relative URLs, so they resolve under the repository path without renaming or modifying the media.

The workflow `.github/workflows/deploy.yml` runs on every push to `main` and also supports manual runs. It installs Node.js 20, runs `npm ci` and `npm run build`, uploads `dist`, and deploys it using the official GitHub Pages actions.

In the repository’s **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. Commit and push these local changes to `main` to trigger deployment. The intended URL is https://vasanthakumar-jpg.github.io/nicoles-closet/.

To check the production build locally, run `npm run build` followed by `npm run preview`, then open http://127.0.0.1:4173/nicoles-closet/.

### Blank screen: source HTML was published

The source `index.html` contains `/src/main.tsx` and is only an input to Vite. GitHub Pages must serve the `dist/index.html` artifact produced by `npm run build`. Changing media paths alone cannot make the source React/TypeScript entry work on static hosting.

On 26 October 2026, both the custom Vite workflow and GitHub’s default `pages-build-deployment` Jekyll workflow ran for commit `272c91e`. The Jekyll deployment finished after the Vite deployment and the live HTML matched the unbuilt source file. This caused the `main.tsx` and literal `%BASE_URL%` 404s.

The required repository setting is **Settings → Pages → Build and deployment → Source → GitHub Actions**, rather than publishing `main` / `(root)`. After changing the setting, push this fix or manually run **Actions → Deploy to GitHub Pages → Run workflow** on `main`. No `gh-pages` branch, committed `dist`, or source-folder publication is needed.

The deployment workflow now checks this source setting and runs `npm run verify:pages` before uploading only `./dist`. This check rejects source HTML, unexpanded placeholders, missing compiled JavaScript/CSS, incorrect base paths, and missing or changed media. It can also be run locally after `npm run build`.
