export type TutorialStep = {
  id: string;
  target: string;
  title: string;
  body: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
};

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'click',
    target: 'click',
    title: 'Process Slots',
    body: 'Click PRODUCE SLOT to process blocks and earn Lamports. Every click pushes your validator forward.',
    tooltipPlacement: 'bottom',
  },
  {
    id: 'resources',
    target: 'resources',
    title: 'Your Resources',
    body: 'BALANCE is your Lamports (1B L = 1 SOL). THROUGHPUT shows income per second. SHREDS are rare drops for premium upgrades.',
    tooltipPlacement: 'bottom',
  },
  {
    id: 'upgrades',
    target: 'upgrades',
    title: 'Buy Upgrades',
    body: 'Spend Lamports on Hashpower, RPC Speed, Vote Credits, and more. Upgrades stack and multiply your earnings.',
    tooltipPlacement: 'bottom',
  },
  {
    id: 'bots',
    target: 'bots',
    title: 'Deploy BPF Bots',
    body: 'BPF Bots generate idle income while you are away. Buy more bots to scale passive Lamport flow.',
    tooltipPlacement: 'top',
  },
  {
    id: 'epoch',
    target: 'epoch',
    title: 'Advance Epoch',
    body: 'Reach 1B Lamports (1 SOL) to prestige. You reset progress but gain permanent Stake Power — a +20% income multiplier each Epoch.',
    tooltipPlacement: 'top',
  },
  {
    id: 'nav',
    target: 'nav',
    title: 'Navigate',
    body: 'Use the bottom tabs to track Achievements and open Config for sound, accessibility, and account settings.',
    tooltipPlacement: 'top',
  },
];
