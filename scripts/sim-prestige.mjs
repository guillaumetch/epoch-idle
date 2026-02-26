#!/usr/bin/env node
/**
 * Simulate time to reach PRESTIGE_THRESHOLD (1B) with stacking upgrades.
 * Buys at most 1 of each upgrade type per tick (plus as many bots as affordable)
 * so growth is stable. Priority: hash3 > hash2 > hash1 > rpc > bots > vote > geyser.
 */

// Tuned so stacking reaches 1B in ~7 min (2x faster)
const BASE = 800;
const HASH = [800, 4_000, 20_000];
const HASH_COSTS = [100_000, 1_000_000, 10_000_000];
const RPC_COST = 500_000;
const RPC_MAX = 5;
const RPC_FACTOR = 0.05;
const VOTE_COST = 25_000_000;
const VOTE_FACTOR = 0.1;
const GEYSER_COST = 100_000_000;
const GEYSER_FACTOR = 0.2;
const BOT_BASE = 1_000_000;
const BOT_MULT = 1.15;
const BOT_INCOME = 400;
const TARGET = 1_000_000_000;
const BASE_CLICKS_PER_SEC = 10;

let lamports = 0;
let h1 = 0, h2 = 0, h3 = 0;
let rpc = 0, vote = 0, geyser = 0;
let bots = 0;
let t = 0;
const dt = 1;

function clickPower() {
  return BASE + h1 * HASH[0] + h2 * HASH[1] + h3 * HASH[2];
}

function clicksPerSec() {
  const reduction = Math.min(rpc, RPC_MAX) * RPC_FACTOR;
  return BASE_CLICKS_PER_SEC / (1 - reduction);
}

function incomeMult() {
  return 1 + vote * VOTE_FACTOR;
}

function idleMult() {
  return 1 + geyser * GEYSER_FACTOR;
}

function botCost(n) {
  return Math.floor(BOT_BASE * Math.pow(BOT_MULT, n));
}

function incomePerSec() {
  const click = clickPower() * clicksPerSec();
  const idle = bots * BOT_INCOME * idleMult();
  return (click + idle) * incomeMult();
}

function buyOne() {
  if (lamports >= HASH_COSTS[2]) {
    lamports -= HASH_COSTS[2];
    h3++;
    return true;
  }
  if (lamports >= HASH_COSTS[1]) {
    lamports -= HASH_COSTS[1];
    h2++;
    return true;
  }
  if (lamports >= HASH_COSTS[0]) {
    lamports -= HASH_COSTS[0];
    h1++;
    return true;
  }
  if (rpc < RPC_MAX && lamports >= RPC_COST) {
    lamports -= RPC_COST;
    rpc++;
    return true;
  }
  if (lamports >= botCost(bots)) {
    lamports -= botCost(bots);
    bots++;
    return true;
  }
  if (lamports >= VOTE_COST) {
    lamports -= VOTE_COST;
    vote++;
    return true;
  }
  if (lamports >= GEYSER_COST) {
    lamports -= GEYSER_COST;
    geyser++;
    return true;
  }
  return false;
}

const MAX_PURCHASES_PER_TICK = 500; // cap so sim runs in reasonable time

while (lamports < TARGET && t < 3600) {
  lamports += incomePerSec() * dt;
  t += dt;
  let purchases = 0;
  while (buyOne() && purchases++ < MAX_PURCHASES_PER_TICK) {}
}

const mins = (t / 60).toFixed(1);
console.log(`Time to 1B L: ${mins} min (${t}s)`);
console.log(`Final: ${(lamports / 1e6).toFixed(2)}M L, ${bots} bots`);
console.log(`Hashpower: I=${h1} II=${h2} III=${h3}  RPC=${rpc}  Vote=${vote}  Geyser=${geyser}`);
console.log(`Rate at end: ${(incomePerSec() / 1e6).toFixed(2)}M L/s`);
