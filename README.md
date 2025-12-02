# kodr-portfolio

The Next.js frontend for [kodr.pro](https://kodr.pro), hosting an interactive Rust + WebAssembly terminal UI built with [Ratatui](https://github.com/ratatui-org/ratatui).

- Desktop: full animated terminal experience powered by a Rust/WASM backend.
- Mobile: a simplified landing page with touch‑friendly links to my profiles.

The terminal engine itself lives in a separate reusable repository:

> Backend: [`kodr-backend`](https://github.com/BradMyrick/kodr-backend)

---

## Features

- Next.js App Router (React)
- [`xterm.js`](https://xtermjs.org/) + `@xterm/addon-web-links` terminal in the browser
- Rust/WASM backend handling all TUI state and rendering
- Desktop‑only TUI; dedicated mobile landing page

---

## Getting Started

### 1. Clone this repo

```
git clone https://github.com/BradMyrick/kodr-portfolio.git
cd kodr-portfolio
```

### 2. Install dependencies

```
npm install  # or pnpm install / yarn install
```

### 3. Provide the WASM backend bundle

This frontend expects the compiled artifacts from the
[`kodr-backend`](https://github.com/BradMyrick/kodr-backend) project
to be available under `public/terminal/`.

#### Option A: Build from source

```
git clone https://github.com/BradMyrick/kodr-backend.git
cd kodr-backend

rustup target add wasm32-unknown-unknown
cargo install wasm-bindgen-cli

cargo build --lib --release --target wasm32-unknown-unknown

wasm-bindgen \
  --target web \
  --out-dir ../kodr-portfolio/public/terminal \
  --no-typescript \
  target/wasm32-unknown-unknown/release/kodr_portfolio_terminal.wasm
```

After this, `public/terminal/` will contain:

- `kodr_portfolio_terminal_bg.wasm`
- `kodr_portfolio_terminal.js`

#### Option B: Use prebuilt artifacts

If this repo includes prebuilt files under `public/terminal/` (or you download them from a release), you can skip the Rust build step and just ensure those files are present.

---

## Running the Dev Server

```
cd kodr-portfolio
npm run dev
```

Then open:

- `http://localhost:3000` in a desktop browser to use the TUI.
- The same URL on mobile to see the mobile‑optimized landing page.

---

## How It Works

### Desktop flow

- A client‑side component (`app/page.tsx`) initializes `xterm.js` in a styled container.
- On mount it dynamically imports `public/terminal/kodr_portfolio_terminal.js`, awaits `default()`, and calls:

  - `init_terminal(cols, rows)`
  - `render_to_ansi()`

- It wires:

  - `term.onKey` and `window.keydown` → `handle_key(e.key)` → `render_to_ansi()`
  - A timer loop → `tick()` → `render_to_ansi()` for animations
  - Resize events → `init_terminal`/`resize` + `render_to_ansi()`

- The ANSI string from `render_to_ansi()` is written into xterm; `@xterm/addon-web-links` makes URLs clickable.

All navigation, scrolling, and rendering decisions happen inside the Rust backend.

### Mobile flow

For small screens (`max-width: 700px`):

- The page renders a static, responsive layout:
  - Project title and tagline
  - Short explanation that the full Rust/WASM TUI is desktop‑only
  - Prominent links to GitHub, X/Twitter, LinkedIn, etc.

The terminal itself is not initialized on mobile.

---

## Project Structure

- `app/page.tsx` – main landing + desktop TUI host (xterm + WASM integration)
- `public/terminal/` – built WASM + JS from `kodr-backend`
- `app/globals.css` (or `styles/`) – global and terminal container styles
- `next.config.js` – standard Next.js config

---

## Deployment

This app deploys like a normal Next.js project (e.g. to Vercel):

1. Ensure `public/terminal/` contains the WASM artifacts at build time.
2. Deploy the repo.
3. The client bundle loads `/terminal/kodr_portfolio_terminal.js` and `/terminal/kodr_portfolio_terminal_bg.wasm` from static assets.

---

## Related Project

- Rust TUI backend: [`kodr-backend`](https://github.com/BradMyrick/kodr-backend)

---

## License

Licensed under the MIT License. See [`LICENSE`](./LICENSE) for details.
