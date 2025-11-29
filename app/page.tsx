"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

function calcTerminalSize(container: HTMLElement, fontSize: number) {
  const charWidth = fontSize * 0.575;
  const charHeight = fontSize * 1;

  const cols = Math.max(10, Math.floor(container.offsetWidth / charWidth) - 5);
  const rows = Math.max(10, Math.floor(container.offsetHeight / charHeight) - 5);

  return { cols, rows };
}

export default function Page() {
  const termRef = useRef<Terminal | null>(null);
  const wasmRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const webLinksRef = useRef<any>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [fontSize, setFontSize] = useState(22); // initial desktop

  const handleAppKey = (key: string) => {
    if (!wasmRef.current || !termRef.current) return;
    wasmRef.current.handle_key(key);

    const ansi = wasmRef.current.render_to_ansi();
    termRef.current.reset();
    termRef.current.write(ansi);

    relink();
  };

  const relink = () => {
    const term = termRef.current;
    const webLinks = webLinksRef.current;
    if (!term || !webLinks) return;

    const buffer = term.buffer.active;
    const lastRow = buffer.length - 1;
    if (lastRow < 0) return;

    if (webLinks._linkifier && typeof webLinks._linkifier.linkifyRows === "function") {
      webLinks._linkifier.linkifyRows(0, lastRow);
    }
  };

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

        // Autofocus terminal so keys just work on load
        const textarea = container.querySelector("textarea");
        if (textarea) {
          (textarea as HTMLTextAreaElement).focus();
        }

        const webLinksAddon = new WebLinksAddon((event, uri) => {
          window.open(uri, "_blank");
        });
        term.loadAddon(webLinksAddon);
        webLinksRef.current = webLinksAddon;

        termRef.current = term;
        wasmRef.current = mod;

        const { cols, rows } = calcTerminalSize(container, fontSize);
        mod.init_terminal(cols, rows);

        const first = mod.render_to_ansi();
        term.write(first);
        relink();

        // Route keys from xterm to WASM app
        const keyDisposable = term.onKey(({ domEvent }) => {
          handleAppKey(domEvent.key);
          domEvent.preventDefault();
        });

        // Global fallback: when focus is not in xterm, still handle keys
        const onWindowKeyDown = (e: KeyboardEvent) => {
          const active = document.activeElement;
          if (
            active &&
            active.tagName === "TEXTAREA" &&
            active.closest("#terminal-container")
          ) {
            // xterm will handle this via onKey
            return;
          }
          handleAppKey(e.key);
        };
        window.addEventListener("keydown", onWindowKeyDown);

        const handleResize = () => {
          if (!termRef.current || !wasmRef.current || !containerRef.current) return;
          const { cols, rows } = calcTerminalSize(containerRef.current, fontSize);
          termRef.current.resize(cols, rows);

          // Prefer a dedicated resize API if it exists, otherwise re-init
          if (typeof wasmRef.current.resize === "function") {
            wasmRef.current.resize(cols, rows);
          } else if (typeof wasmRef.current.init_terminal === "function") {
            wasmRef.current.init_terminal(cols, rows);
          }

          const ansi = wasmRef.current.render_to_ansi();
          termRef.current.reset();
          termRef.current.write(ansi);
          relink();
        };

        window.addEventListener("resize", handleResize);

        const tickLoop = () => {
          if (!mounted || !wasmRef.current || !termRef.current) return;
          if (typeof wasmRef.current.tick === "function") {
            wasmRef.current.tick();
            const ansi = wasmRef.current.render_to_ansi();

            // Clear + home via escape, then redraw frame
            termRef.current.write("\x1b[2J\x1b[H");
            termRef.current.write(ansi);
            relink();
          }
          setTimeout(tickLoop, 80);
        };
        tickLoop();

        (window as any).__kodr_tui_cleanup = () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("keydown", onWindowKeyDown);
          keyDisposable.dispose();
          term.dispose();
          termRef.current = null;
          wasmRef.current = null;
          webLinksRef.current = null;
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

  // Mobile buttons: send the same chars Rust expects for section jumps/help
  const sendKey = (key: string) => {
    handleAppKey(key);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-900 to-black p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl -mb-0.5">🦀</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-linear-to-r from-yellow-400 via-blue-500 to-green-400 drop-shadow-lg">
              kodr.pro TUI
            </h1>
            <span className="text-3xl -mb-0.5">🌐</span>
          </div>

          <div className="mt-2 text-center text-sm sm:text-base font-semibold text-gray-300 tracking-wide">
            Built with Rust &bull; WebAssembly by{" "}
            <span className="inline-block bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-cyan-400 to-blue-500 drop-shadow-md">
              Brad Myrick
            </span>
          </div>
        </div>


        <div
          ref={containerRef}
          id="terminal-container"
          className="terminal-container box-border rounded-2xl border border-green-500/80 overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.35)] bg-[#18181a]"
          style={{
            width: isMobile ? "100%" : "1000px",
            height: isMobile ? "60vh" : "640px",
          }}
        />

        {isMobile && (
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <button
                className="px-4 py-2 rounded-xl bg-linear-to-br from-gray-800/90 to-gray-900/90 border border-white/10 text-gray-100 text-xs font-semibold shadow-lg shadow-black/40 active:scale-[0.97] transition-transform backdrop-blur flex flex-col items-center gap-1"
                onClick={() => sendKey("1")}
              >
                <span className="text-sm leading-none">1</span>
                <span className="text-[0.7rem] tracking-wide">Hero</span>
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-linear-to-br from-gray-800/90 to-gray-900/90 border border-white/10 text-gray-100 text-xs font-semibold shadow-lg shadow-black/40 active:scale-[0.97] transition-transform backdrop-blur flex flex-col items-center gap-1"
                onClick={() => sendKey("2")}
              >
                <span className="text-sm leading-none">2</span>
                <span className="text-[0.7rem] tracking-wide">Journey</span>
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-linear-to-br from-gray-800/90 to-gray-900/90 border border-white/10 text-gray-100 text-xs font-semibold shadow-lg shadow-black/40 active:scale-[0.97] transition-transform backdrop-blur flex flex-col items-center gap-1"
                onClick={() => sendKey("3")}
              >
                <span className="text-sm leading-none">3</span>
                <span className="text-[0.7rem] tracking-wide">Projects</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <button
                className="px-4 py-2 rounded-xl bg-linear-to-br from-gray-800/90 to-gray-900/90 border border-white/10 text-gray-100 text-xs font-semibold shadow-lg shadow-black/40 active:scale-[0.97] transition-transform backdrop-blur flex flex-col items-center gap-1"
                onClick={() => sendKey("4")}
              >
                <span className="text-sm leading-none">4</span>
                <span className="text-[0.7rem] tracking-wide">Skills</span>
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-linear-to-br from-gray-800/90 to-gray-900/90 border border-white/10 text-gray-100 text-xs font-semibold shadow-lg shadow-black/40 active:scale-[0.97] transition-transform backdrop-blur flex flex-col items-center gap-1"
                onClick={() => sendKey("5")}
              >
                <span className="text-sm leading-none">5</span>
                <span className="text-[0.7rem] tracking-wide">Contact</span>
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-linear-to-br from-sky-500 to-indigo-600 border border-sky-300/40 text-white text-xs font-semibold shadow-lg shadow-sky-900/40 active:scale-[0.97] transition-transform flex flex-col items-center gap-1"
                onClick={() => sendKey("h")}
              >
                <span className="text-sm leading-none">?</span>
                <span className="text-[0.7rem] tracking-wide">Help</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
