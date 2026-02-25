# EPOCH Idle

**A Solana-themed idle game built for [Hackathon Name].** Play as a fledgling validator: process slots, earn Lamports, buy upgrades, deploy BPF Bots, and advance Epochs for permanent multipliers. No wallet required—just open and play.

---

## Why we built it

Solana has great tech and a rich validator/RPC ecosystem, but it can feel abstract to newcomers. We wanted a **low-friction, fun way** to expose people to real concepts (slots, Lamports, shreds, Geyser, Jito, Epochs) without requiring a wallet or any blockchain knowledge. An idle game fit perfectly: familiar loop, short sessions, and room to layer in optional on-chain features later (ACHIEVO, cNFTs, cloud save).

## What we built

**EPOCH Idle** is a browser-based incremental game with a full MVP: click-to-process slots, upgrade tree, BPF Bots for idle income, Epoch prestige for permanent multipliers, achievements, offline progress, and a neon Solana-themed UI. Everything runs client-side with local persistence so anyone can try it in one click. The codebase is structured so we can add wallet auth, server sync, and verifiable achievement badges in a follow-up.

## Goals for this submission

- **Ship a complete, playable game** — One session from zero to first prestige (~15 min) with no setup.
- **Make Solana tangible** — Real validator/ecosystem terms in a game loop that sticks.
- **Show we can extend it** — Roadmap to ACHIEVO, cNFTs, and cloud save proves the idea scales beyond the hackathon.

## Features

- **Core Game Loop**: Click to process slots and earn Lamports
- **Upgrades System**: Purchase various upgrades to increase income and efficiency
- **BPF Bots**: Deploy automated bots for idle income
- **Prestige System**: Advance Epochs to gain permanent multipliers
- **Visual Effects**: Neon Solana-themed UI with animations
- **Local Persistence**: Auto-saves your progress
- **Mobile Responsive**: Optimized for both desktop and mobile

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Zustand** for state management
- **requestAnimationFrame** for smooth game loop

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Game Mechanics

### Resources

- **Lamports**: Primary currency (1e9 = 1 SOL)
- **Shreds**: Rare drops (5% chance) used for special upgrades
- **Stake Power**: Permanent multiplier gained from prestiging (+20% per Epoch)

### Upgrades

- **Hashpower I/II/III**: Increase lamports per click
- **RPC Speed**: Reduce click cooldown (stacks up to -25%)
- **Vote Credits**: +10% all income (stacks)
- **Geyser Index**: +20% idle income (stacks)
- **Merkle Optimizer** (Shreds): 5% crit chance for ×10 payout
- **Jito Tip Jar** (Shreds): 5% chance for +1% of bank

### BPF Bots

- Each bot generates 14K L/s
- Cost increases by 15% per bot (1M L base)

### Prestige (Advance Epoch)

- Unlock at 1,000,000,000 lamports (1 SOL)
- Resets lamports, upgrades, and bots
- Grants +20% Stake Power (permanent multiplier)
- Target: First prestige in ≤15 minutes

## Project Structure

```
epoch-idle/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main game page
│   └── globals.css        # Global styles
├── components/
│   └── game/              # Game components
├── lib/
│   ├── game/              # Game logic
│   ├── store/             # Zustand store
│   └── utils/             # Utilities
├── types/                 # TypeScript types
└── public/                # Static assets
```

## Roadmap

### Phase 1 (MVP) - ✅ Complete
- Core game loop
- Upgrades system
- Bot automation
- Prestige system
- Local persistence
- UI/UX with Solana theme

### Phase 2 (Post-MVP)
- Backend integration (Cloudflare Worker + Supabase)
- Wallet authentication
- Server-side progress sync
- Anti-cheat measures

### Phase 3 (Post-MVP)
- ACHIEVO integration
- Achievement badges (cNFTs)
- Milestone tracking

## License

MIT






