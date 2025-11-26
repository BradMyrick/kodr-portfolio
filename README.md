# kodr.pro Terminal (Ratatui + WASM + Next.js)

A terminal-style portfolio for kodr.pro, built in Rust with Ratatui and compiled to WebAssembly, then rendered inside a Next.js app.

## Overview

- Rust + Ratatui for layout, widgets, and rendering.
- Custom WASM glue using `wasm-bindgen` to expose a small API to the browser.
- Next.js frontend that loads the generated `.js/.wasm` bundle and displays the terminal output in a `<pre>` block, forwarding keyboard events from the browser to Rust.

The goal is to keep all terminal UI logic in Rust while using React/Next.js only as a thin host and integration layer.

## Project Structure

- `kodr-portfolio-terminal/` – Rust crate containing the Ratatui app.
  - `src/app.rs` – Application state + input handling (`AppKey` enum, sections, scrolling).
  - `src/lib.rs` – WASM entry points (`init_terminal`, `handle_key`, `render_to_string`).
  - `src/state.rs`, `src/ui/` – State and rendering of sections (Hero, Journey, Projects, Skills, Contact).
- `kodr-portfolio/` – Next.js site.
  - `public/terminal/` – Output from the Rust WASM build (`*.js`, `*.wasm`).
  - `app/(or pages)/terminal.tsx` – React component that loads the WASM module and renders the TUI.

## Rust / WASM Build

1) Install the WASM target and wasm-bindgen CLI:

- `rustup target add wasm32-unknown-unknown`  
- `cargo install wasm-bindgen-cli`

2) Build the Ratatui WASM library:

- From `kodr-portfolio-terminal/` run:

- `cargo build --lib --release --target wasm32-unknown-unknown`

3) Run `wasm-bindgen` to generate the JS bindings:

- `wasm-bindgen --target web --out-dir ../kodr-portfolio/public/terminal --no-typescript target/wasm32-unknown-unknown/release/kodr_portfolio_terminal.wasm`

This produces:

- `kodr_portfolio_terminal_bg.wasm`  
- `kodr_portfolio_terminal.js`  

These are served by Next.js from `/terminal/…`.

## Ratatui Rendering Model

The Rust side uses Ratatui’s `TestBackend` to render into an in-memory buffer and then returns it as a string for display in the browser.

Key exposed functions (via `#[wasm_bindgen]` in `lib.rs`):

- `init_terminal(cols: u16, rows: u16)` – Set terminal size and reset application state.
- `handle_key(key: String)` – Accepts `KeyboardEvent.key` values from the browser (`"ArrowUp"`, `"ArrowDown"`, `"j"`, `"1"`, etc.), maps them to an internal `AppKey` enum, and updates state.
- `render_to_string() -> String` – Renders the current UI to a string (one line per row), which the frontend inserts into a `<pre>` element.

This keeps the rendering loop entirely in Rust while the browser just displays the result and sends input.

## Next.js Integration

In the Next.js app:

1) Place the WASM output in `public/terminal/` (as shown above).

2) In a client-side React component (e.g. `app/terminal/page.tsx`):

- Dynamically import the generated JS module on the client.
- Call the exported `init_terminal`, `handle_key`, and `render_to_string` functions.
- Render the returned string inside a `<pre>` and update on every keypress.

Example sketch (TypeScript, client component):

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function Terminal() {
  const wasmRef = useRef<any>(null);
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function loadWasm() {
      if (typeof window === "undefined") return;

      const wasm = await import("/terminal/kodr_portfolio_terminal.js");
      await wasm.default(); // init wasm-bindgen module

      wasm.init_terminal(80, 24);
      const initial = wasm.render_to_string();

      if (mounted) {
        wasmRef.current = wasm;
        setOutput(initial);
      }
    }

    loadWasm();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!wasmRef.current) return;

      wasmRef.current.handle_key(e.key);
      const rendered = wasmRef.current.render_to_string();
      setOutput(rendered);
      e.preventDefault();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-green-300">
      <pre className="font-mono text-sm leading-tight whitespace-pre">
        {output}
      </pre>
    </div>
  );
}
```

This pattern follows common Next.js + WASM setups: load WASM only on the client, expose a small API, and keep state inside the WASM module.

## Development Workflow

- Edit Rust TUI code in `kodr-portfolio-terminal/`.
- Rebuild WASM and bindings when Rust changes.
- Refresh the Next.js page to see updated behavior.

Typical commands:

- `cd kodr-portfolio-terminal`
- `cargo build --lib --release --target wasm32-unknown-unknown`
- `wasm-bindgen …` to `kodr-portfolio/public/terminal`
- `cd ../kodr-portfolio`
- `npm run dev` (or `pnpm dev` / `yarn dev`) to run the Next.js dev server.

## Tech Stack

- Rust, Ratatui for terminal UI.
- wasm-bindgen + `wasm32-unknown-unknown` target for WebAssembly.
- Next.js (React) for hosting, routing, and client-side integration.

This setup lets the portfolio experience feel like a real terminal while remaining fully web-native, deployable on platforms like Vercel.
