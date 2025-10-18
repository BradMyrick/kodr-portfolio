# Kodr.pro - Polyglot Development Platform Landing Page

## Overview
This is the new landing page for Kodr.pro, repositioned as a polyglot development platform built on WebAssembly and Cap'n Proto RPC.

## Key Changes from Previous Version
- **Complete pivot** from smart contract collaboration to polyglot WASM development platform
- **New messaging** focused on unifying Rust, Go, Python, and JavaScript development
- **Technical focus** on WebAssembly compilation and Cap'n Proto RPC
- **Removed** all authentication/login features (now using early access signup)
- **Added** lead generation with early access form

## Features

### Hero Section
- Clear value proposition: "Unify Your Polyglot Development with WebAssembly"
- Interactive code tabs showing Rust, Go, Python, and JavaScript examples
- Direct CTAs to early access signup and whitepaper

### Content Sections
1. **Problem/Solution** - Highlights integration pain points and WASM+RPC solution
2. **Core Features** - Universal compilation, zero-friction integration, browser IDE, deploy everywhere
3. **Performance Metrics** - Real benchmarks showing 3-10x improvements
4. **Technical Credibility** - WebAssembly adoption, Cap'n Proto at scale, security benefits
5. **Target Markets** - Blockchain/Web3, Edge Computing, High-Performance Web
6. **Early Access Form** - Lead capture with language preferences and use cases

## Tech Stack
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Code Highlighting**: Prism.js
- **State Management**: React hooks

## Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080       # Backend API
NEXT_PUBLIC_GITHUB_URL=https://github.com/kodr-pro
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/kodr_eth
NEXT_PUBLIC_WHITEPAPER_URL=/kodr.pdf
```

## Early Access Backend
The early access form posts to `/early-access` endpoint which:
- Stores signups in BadgerDB
- Tracks languages of interest
- Records use cases for product development
- Provides admin stats endpoint

## Development
```bash
npm install
npm run dev    # Starts on http://localhost:3000
```

## Building
```bash
npm run build  # Production build
npm start      # Serve production build
```

## Components Created
- `CodeTabs` - Language switcher with syntax highlighting
- `CodeBlock` - Prism.js powered syntax highlighting
- `MetricCard` - Performance metric displays
- `EarlyAccessForm` - Lead capture form

## Content Management
- Copy is centralized in `content/copy.json`
- Whitepaper brief in `content/whitepaper-brief.md`

## Future Enhancements (Phase 2)
- Monaco Editor integration for live code playground
- WebAssembly compilation demos
- Cap'n Proto RPC interactive examples
- Performance dashboard with real metrics