#!/usr/bin/env node
/**
 * Simulate time to reach PRESTIGE_THRESHOLD (1B) with current constants.
 * Assumes: max clicks (10/s), buy hashpower1→2→3, then bots when affordable.
 */

// Match lib/constants.ts (tuned so first prestige ~15 min)
const BASE = 28_000;
const HASH = [28_000, 140_000, 700_000];
const HASH_COSTS = [100_000, 1_000_000, 10_000_000];
const BOT_BASE = 1_000_000;
const BOT_MULT = 1.15;
const BOT_INCOME = 14_000;
const TARGET = 1_000_000_000;
const CLICKS_PER_SEC = 10;

let lamports = 0;
let hashpower = [0, 0, 0];
let bots = 0;
let t = 0;
const dt = 1; // 1 second steps

function clickPower() {
  return BASE + hashpower[0] * HASH[0] + hashpower[1] * HASH[1] + hashpower[2] * HASH[2];
}

function botCost(n) {
  return Math.floor(BOT_BASE * Math.pow(BOT_MULT, n));
}

function incomePerSec() {
  const click = clickPower() * CLICKS_PER_SEC;
  const idle = bots * BOT_INCOME;
  return click + idle;
}

while (lamports < TARGET && t < 1200) {
  const rate = incomePerSec();
  lamports += rate * dt;
  t += dt;

  // Buy in order: hash1, hash2, hash3, then bots
  if (hashpower[0] === 0 && lamports >= HASH_COSTS[0]) {
    lamports -= HASH_COSTS[0];
    hashpower[0] = 1;
  }
  if (hashpower[0] === 1 && hashpower[1] === 0 && lamports >= HASH_COSTS[1]) {
    lamports -= HASH_COSTS[1];
    hashpower[1] = 1;
  }
  if (hashpower[1] === 1 && hashpower[2] === 0 && lamports >= HASH_COSTS[2]) {
    lamports -= HASH_COSTS[2];
    hashpower[2] = 1;
  }
  while (lamports >= botCost(bots)) {
    lamports -= botCost(bots);
    bots++;
  }
}

const mins = (t / 60).toFixed(1);
console.log(`Time to 1B L: ${mins} min (${t}s)`);
console.log(`Final: ${(lamports / 1e6).toFixed(2)}M L, ${bots} bots, hash ${hashpower.join('/')}`);
console.log(`Rate at end: ${(incomePerSec() / 1e6).toFixed(2)}M L/s`);
