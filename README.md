# Trading Desk

A lightweight, single-page trading workspace with one navigation bar and session notes saved in browser storage. Market data and broker integration are not connected.

The collapsible sidebar also links to `/calculator`: enter an amount and adjust the 0–100% slider to calculate a percentage instantly. The amount and percentage save automatically in the same browser and can be edited at any time. Browser storage must be available for persistence.

## Run

Use Node.js 24 and run `npm start` from this directory. The server listens on port 3000 (override with `PORT`). No dependency installation is required.

## GitHub Pages

In the repository's Settings → Pages, set Source to **GitHub Actions**. The included workflow deploys the static site on pushes to `main` and can also be run manually. No hosting secrets are required. Relative asset and navigation URLs support the `/Trading/` project path.

Expected address after a successful deployment: https://danratoiu.github.io/Trading/

Styles are embedded in both HTML pages so rendering does not depend on fetching a separate CSS file. Edit `styles.css`, then run `npm run build` to sync both pages. The deployment workflow runs this automatically.
