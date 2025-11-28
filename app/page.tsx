"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

function calcTerminalSize(container: HTMLElement, fontSize: number) {
  const charWidth = fontSize * 0.575;
  const charHeight = fontSize * 1;

  // Leave a 2‑cell margin on each side
  const cols = Math.max(10, Math.floor(container.offsetWidth / charWidth) - 5);
  const rows = Math.max(10, Math.floor(container.offsetHeight / charHeight) - 5);

  return { cols, rows };
}

export default function Page() {
  const termRef = useRef<Terminal | null>(null);
  const wasmRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [fontSize, setFontSize] = useState(22); // initial desktop

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const apply = () => {
      setIsMobile(mq.matches);
      setFontSize(mq.matches ? 16 : 22);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initTerminal = async () => {
      try {
        const mod = await import("@/app/terminal/kodr_portfolio_terminal");
        await mod.default();

        // Import WebLinksAddon only on the client
        const { WebLinksAddon } = await import("@xterm/addon-web-links");

        const container = containerRef.current;
        if (!container) return;

        const term = new Terminal({
          fontFamily: "JetBrains Mono, Fira Mono, Menlo, monospace",
          fontSize,
          theme: {
            background: "#18181a",
            foreground: "#cccccc",
          },
          cols: 90,
          rows: 32,
          allowTransparency: true,
          scrollback: 200,
          cursorBlink: false,
          disableStdin: false,
          convertEol: true,
        });

        term.open(container);

        const webLinksAddon = new WebLinksAddon((event, uri) => {
          window.open(uri, "_blank");
        });
        term.loadAddon(webLinksAddon);

        termRef.current = term;
        wasmRef.current = mod;

        const { cols, rows } = calcTerminalSize(container, fontSize);
        mod.init_terminal(cols, rows);

        const first = mod.render_to_ansi();
        term.write(first);

        // Route keys from xterm to WASM app
        const keyDisposable = term.onKey(({ domEvent }) => {
          if (!wasmRef.current || !termRef.current) return;
          wasmRef.current.handle_key(domEvent.key);
          const ansi = wasmRef.current.render_to_ansi();
          termRef.current.reset();
          termRef.current.write(ansi);
          domEvent.preventDefault();
        });

        const handleResize = () => {
          if (!termRef.current || !wasmRef.current || !containerRef.current) return;
          const { cols, rows } = calcTerminalSize(containerRef.current, fontSize);
          termRef.current.resize(cols, rows);
          wasmRef.current.resize(cols, rows);
          const ansi = wasmRef.current.render_to_ansi();
          termRef.current.reset();
          termRef.current.write(ansi);
        };

        window.addEventListener("resize", handleResize);

        const tickLoop = () => {
          if (!mounted || !wasmRef.current || !termRef.current) return;
          if (typeof wasmRef.current.tick === "function") {
            wasmRef.current.tick();
            const ansi = wasmRef.current.render_to_ansi();
            termRef.current.reset();
            termRef.current.write(ansi);
          }
          setTimeout(tickLoop, 80);
        };
        tickLoop();

        (window as any).__kodr_tui_cleanup = () => {
          window.removeEventListener("resize", handleResize);
          keyDisposable.dispose();
          term.dispose();
          mounted = false;
        };
      } catch (err) {
        console.error("Failed to initialize terminal:", err);
      }
    };

    initTerminal();

    return () => {
      mounted = false;
      if ((window as any).__kodr_tui_cleanup) {
        (window as any).__kodr_tui_cleanup();
      }
    };
  }, [fontSize]);

  const sendKey = (key: string) => {
    if (!wasmRef.current || !termRef.current) return;
    wasmRef.current.handle_key(key);
    const ansi = wasmRef.current.render_to_ansi();
    termRef.current.reset();
    termRef.current.write(ansi);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl mb-[-2px]">🦀</span>
            <h1 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-blue-500 to-green-400 drop-shadow-lg">
              kodr.pro TUI
            </h1>
            <span className="text-3xl mb-[-2px]">🌐</span>
          </div>
          <div className="text-xl font-semibold text-gray-300 mt-2 tracking-wide text-center">
            Rust x WebAssembly &bull; Blockchain &bull; Founder
          </div>
        </div>

        <div
          ref={containerRef}
          id="terminal-container"
          className="terminal-container box-border rounded-xl border border-green-500 overflow-hidden shadow-2xl bg-[#18181a]"
          style={{
            width: isMobile ? "100%" : "1000px",
            height: isMobile ? "60vh" : "640px",
          }}
        />

        {isMobile && (
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <button
              className="px-4 py-2 rounded-md bg-gray-800 text-gray-100 border border-gray-600 text-sm"
              onClick={() => sendKey("ArrowUp")}
            >
              ▲ Up
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gray-800 text-gray-100 border border-gray-600 text-sm"
              onClick={() => sendKey("ArrowDown")}
            >
              ▼ Down
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gray-800 text-gray-100 border border-gray-600 text-sm"
              onClick={() => sendKey("ArrowLeft")}
            >
              ◀ Prev
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gray-800 text-gray-100 border border-gray-600 text-sm"
              onClick={() => sendKey("ArrowRight")}
            >
              ▶ Next
            </button>
            <button
              className="px-4 py-2 rounded-md bg-yellow-500 text-black font-semibold text-sm"
              onClick={() => sendKey("Enter")}
            >
              Enter
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
