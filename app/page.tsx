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

  const [isMobile, setIsMobile] = useState(false);
  const [fontSize, setFontSize] = useState(22); // initial desktop

  const handleAppKey = (key: string) => {
    if (!wasmRef.current || !termRef.current) return;
    wasmRef.current.handle_key(key);

    const ansi = wasmRef.current.render_to_ansi();
    termRef.current.reset();
    termRef.current.write(ansi);
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
    let hoveringLink = false;

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

        // Web links addon with hover tracking so we can pause redraws
        const activateLink = (event: MouseEvent, uri: string) => {
          // Let browser handle default link behavior; ensure new tab.
          event.preventDefault();
          window.open(uri, "_blank", "noopener,noreferrer");
        };

        const webLinksAddon = new WebLinksAddon(activateLink, {
          // Called when mouse enters a link
          hover: () => {
            hoveringLink = true;
          },
          // Called when mouse leaves a link
          leave: () => {
            hoveringLink = false;
          },
          // Allow mailto: etc. as well as http(s)
          allowNonHttpProtocols: true,
        } as any);
        term.loadAddon(webLinksAddon);

        termRef.current = term;
        wasmRef.current = mod;

        const { cols, rows } = calcTerminalSize(container, fontSize);
        mod.init_terminal(cols, rows);

        const first = mod.render_to_ansi();
        term.write(first);

        // Route keyboard events from xterm to WASM app
        const keyDisposable = term.onKey(({ domEvent }) => {
          if (domEvent.type !== "keydown") return;
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

          if (typeof wasmRef.current.resize === "function") {
            wasmRef.current.resize(cols, rows);
          } else if (typeof wasmRef.current.init_terminal === "function") {
            wasmRef.current.init_terminal(cols, rows);
          }

          const ansi = wasmRef.current.render_to_ansi();
          termRef.current.reset();
          termRef.current.write(ansi);
        };

        window.addEventListener("resize", handleResize);

        const tickLoop = () => {
          if (!mounted || !wasmRef.current || !termRef.current) return;

          // Skip redraw while hovering a link so clicks are not interrupted.
          if (!hoveringLink && typeof wasmRef.current.tick === "function") {
            wasmRef.current.tick();
            const ansi = wasmRef.current.render_to_ansi();

            termRef.current.write("\x1b[2J\x1b[H");
            termRef.current.write(ansi);
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

  // If mobile: show simple landing instead of TUI
  if (isMobile) {
    return (
      <main className="min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-950 px-4 py-10">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl -mb-0.5">🦀</span>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-yellow-400 via-blue-500 to-green-400 drop-shadow-lg">
              kodr.pro TUI
            </h1>
            <span className="text-3xl -mb-0.5">🌐</span>
          </div>

          <p className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-3">
            Built with Rust · WebAssembly
          </p>

          <p className="text-base text-gray-200 mb-6">
            This site is an interactive terminal UI built in Rust and compiled to
            WebAssembly. For the full experience (keyboard navigation, animations,
            and links), please visit on a desktop browser.
          </p>

          <div className="w-full h-px bg-linear-to-r from-transparent via-emerald-500/60 to-transparent mb-6" />

          <div className="w-full space-y-3">
            <a
              href="https://github.com/bradmyrick"
              target="_blank"
              rel="noreferrer"
              className="block w-full px-4 py-3 rounded-xl bg-linear-to-r from-gray-800 to-gray-900 border border-white/10 text-gray-100 text-sm font-medium shadow-lg shadow-black/40 active:scale-[0.97] transition-transform"
            >
              GitHub
            </a>
            <a
              href="https://x.com/kodr_pro"
              target="_blank"
              rel="noreferrer"
              className="block w-full px-4 py-3 rounded-xl bg-linear-to-r from-sky-500 to-blue-600 border border-sky-300/40 text-white text-sm font-medium shadow-lg shadow-sky-900/40 active:scale-[0.97] transition-transform"
            >
              Twitter / X
            </a>
            <a
              href="https://www.linkedin.com/in/brad-myrick-35327b258"
              target="_blank"
              rel="noreferrer"
              className="block w-full px-4 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 border border-indigo-300/40 text-white text-sm font-medium shadow-lg shadow-indigo-900/40 active:scale-[0.97] transition-transform"
            >
              LinkedIn
            </a>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            Built by{" "}
            <span className="font-semibold text-emerald-300">Brad Myrick</span>.
            Desktop terminal UI coming soon to mobile.
          </p>
        </div>
      </main>
    );
  }

  // Desktop TUI
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
            width: "1000px",
            height: "640px",
          }}
        />
      </div>
    </main>
  );
}
