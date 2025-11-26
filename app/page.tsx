"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

// Helper to detect mobile
const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches;

// Calculate cols/rows based on container size and font metrics
function calcTerminalSize(container: HTMLElement, fontSize: number) {
  // Estimate JetBrains Mono/Fira Mono metrics
  const charWidth = fontSize * 0.575;
  const charHeight = fontSize * 1;
  const cols = Math.floor(container.offsetWidth / charWidth);
  const rows = Math.floor(container.offsetHeight / charHeight);
  return { cols, rows };
}

export default function Page() {
  const termRef = useRef<Terminal | null>(null);
  const wasmRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Responsive value for font size
  const [fontSize, setFontSize] = useState(isMobile ? 16 : 22);

  useEffect(() => {
    let mounted = true;

    const initTerminal = async () => {
      try {
        const mod = await import("@/app/terminal/kodr_portfolio_terminal");
        await mod.default();

        const container = containerRef.current;
        if (!container) return;

        const term = new Terminal({
          fontFamily: "JetBrains Mono, Fira Mono, Menlo, monospace",
          fontSize,
          theme: {
            background: "#18181a",
            foreground: "#cccccc",
          },
          cols: 90, // Initial, will be recalculated
          rows: 32,
          allowTransparency: true,
          scrollback: 200,
          cursorBlink: false,
          disableStdin: false,
          convertEol: true,
        });

        term.open(container);
        termRef.current = term;
        wasmRef.current = mod;

        // Set terminal size based on container and font metrics
        const { cols, rows } = calcTerminalSize(container, fontSize);
        mod.init_terminal(cols, rows);

        // Initial render
        const first = mod.render_to_ansi();
        term.write(first);

        // Handle window resize: update cols/rows
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

        // Key handling for desktop
        const onKeyDown = (e: KeyboardEvent) => {
          if (!wasmRef.current || !termRef.current) return;
          wasmRef.current.handle_key(e.key);
          const ansi = wasmRef.current.render_to_ansi();
          termRef.current.reset();
          termRef.current.write(ansi);
          e.preventDefault();
        };

        window.addEventListener("keydown", onKeyDown);

        // Animation tick (call Rust tick every 80ms)
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
          window.removeEventListener("keydown", onKeyDown);
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

  // For future: mobile overlays/touch navigation
  // const isMobile = ... // use any media query/react hook
  // TODO: Add overlay buttons for navigation, attach to WASM handle_key

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            {/* Example SVG or emoji icon */}
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
          className="terminal-container"
          style={{
            width: isMobile ? "100vw" : "1100px",
            height: isMobile ? "60vh" : "700px",
          }}
        />
      </div>
    </main>
  );
}
