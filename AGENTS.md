# Working on Compose Key Trainer

A single-page React and Vite app, deployed to GitHub Pages under
`/compose-key-trainer/`. The design rules are in [DESIGN.md](DESIGN.md).

## Checks

Run these before calling a change done. CI runs the first two and a build.

```sh
npm run lint
npm run typecheck
npx prettier --check .
```

There is no test suite, so a change to the interface is checked in a browser.

## Checking UI changes

Start the dev server with `npm run dev` and open
http://localhost:5173/compose-key-trainer/. Use the `chrome-devtools` browser
tools, and check practice and challenge mode:

- Widths 320, 375, 414, 768, 1024 and 1440. At each,
  `document.documentElement.scrollWidth` equals the viewport width, and the
  page does not scroll when its content fits.
- Touch emulation at the phone and tablet widths. Buttons and deck labels are
  at least 44px tall, and the answer field keeps text of 16px or more.
- A mouse, with no touch emulation, at 1024 and 1440. The touch rule holds
  only under `pointer: coarse`, so the deck rows stay compact (about 23px
  with 12px between them) and the sidebar stays 240px wide.
- Slow 3G with the cache disabled, on `npm run build` then `npm run preview`
  (http://localhost:4173/compose-key-trainer/). Watch the first paint and any
  layout shift while the bundle loads.
- Long content and empty states: the longest key sequence wraps cleanly at
  320px, and turning every deck off shows the empty state.
- Close the pages and stop the servers when done.
