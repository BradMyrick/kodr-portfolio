declare module '/terminal/kodr_portfolio_terminal.js' {
    export default function init(): Promise<void>;
    export function start_terminal(container_id: string): void;
}
