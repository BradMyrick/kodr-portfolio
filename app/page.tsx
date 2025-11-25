'use client';

import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    const initTerminal = async () => {
      try {
        // Import the wasm-bindgen JS glue
        const mod = await import('@/public/terminal/kodr_portfolio_terminal');

        // IMPORTANT: first call the default initializer, which loads the .wasm
        await mod.default();

        // Now call the exported wasm functions from Rust
        mod.init_terminal(80, 24);

        const el = document.getElementById('terminal-container');
        if (el) {
          const first = mod.render_to_string();
          el.textContent = first;
        }

        window.addEventListener('keydown', (e) => {
          mod.handle_key(e.key);
          const el2 = document.getElementById('terminal-container');
          if (el2) {
            el2.textContent = mod.render_to_string();
          }
        });
      } catch (err) {
        console.error('Failed to initialize terminal:', err);
      }
    };

    initTerminal();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">kodr.pro TUI | Rust x WebAssembly</h1>
        <pre id="terminal-container" className="tui-pre" />
      </div>
    </main>
  );
}
