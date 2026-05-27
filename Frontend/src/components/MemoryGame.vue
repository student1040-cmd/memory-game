<template>
  <div class="game-container">
    <div class="game-glow"></div>
    <div class="game-header">
      <div class="lvl-tag">
        <span class="lvl-pip"></span>
        Рівень {{ currentLevel + 1 }}
      </div>
      <div class="stats-group">
        <div class="s-item">
          <span>⏱ ЧАС</span>
          <strong>{{ formatTime(timer) }}</strong>
        </div>
        <div class="s-item">
          <span>🎯 ХОДИ</span>
          <strong>{{ turns }}</strong>
        </div>
      </div>
    </div>

    <div class="grid" :style="gridStyle">
      <div v-for="(card, index) in cards" :key="index" class="card"
           :class="{ 'is-flipped': card.flipped || card.matched, 'is-matched': card.matched }"
           @click="flipCard(index)">
        <div class="card-inner">
          <div class="card-front">
            <div class="card-pattern"></div>
            <span class="card-mark">?</span>
          </div>
          <div class="card-back">{{ card.value }}</div>
        </div>
      </div>
    </div>

    <transition name="win-pop">
      <div v-if="isWin" class="win-banner">
        <span class="win-emoji">🏆</span>
        <div>
          <strong>Вітаємо!</strong>
          <p>Рівень пройдено за {{ formatTime(timer) }} та {{ turns }} ходів</p>
        </div>
      </div>
    </transition>

    <div class="controls">
      <button @click="initGame" class="btn-refresh">
        <span>↻ Скинути</span>
      </button>
      <button @click="forceQuit" class="btn-quit">
        <span>✕ Вийти</span>
      </button>
      <button v-if="isWin && currentLevel < 9" @click="nextLevel" class="btn-next">
        <span>Далі →</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, defineEmits, defineProps, watch } from 'vue';
import { db, ref as dbRef, push, set } from '../firebase';

const emit = defineEmits(['update-leaderboard', 'level-changed', 'card-flipped']);
const props = defineProps(['manualLevel', 'userNickname']);

const levels = [
  {cols:2, pairs:2}, {cols:3, pairs:3}, {cols:4, pairs:4},
  {cols:4, pairs:6}, {cols:4, pairs:8}, {cols:5, pairs:10},
  {cols:6, pairs:12}, {cols:6, pairs:15}, {cols:7, pairs:21},
  {cols:8, pairs:32}
];

const emojis = ['🐬','🐳','🐙','🦑','🦀','🐡','🐠','🦈','🐚','🚢','🏝️','🧜‍♀️','🐧','⚓','🌊','🛶','🧊','🏄','🔱','🧿','🍀','💎','🔥','🎸','🛸','👑','🌈','🛰️','🦋','🐱','🍕','🍊'];

const emojiToId = {
  '🐬': 'dolphin', '🐳': 'whale', '🐙': 'octopus', '🦑': 'squid',
  '🦀': 'crab', '🐡': 'pufferfish', '🐠': 'fish', '🦈': 'shark',
  '🐚': 'shell', '🚢': 'ship', '🏝️': 'island', '🧜‍♀️': 'mermaid',
  '🐧': 'penguin', '⚓': 'anchor', '🌊': 'wave', '🛶': 'canoe',
  '🧊': 'ice', '🏄': 'surfer', '🔱': 'trident'
};

const currentLevel = ref(0);
const cards = ref([]);
const turns = ref(0);
const timer = ref(0);
const isWin = ref(false);
const lockBoard = ref(true);
const firstCard = ref(null);
let interval = null;

watch(() => props.manualLevel, (newVal) => {
  if (newVal !== undefined && newVal !== currentLevel.value) {
    currentLevel.value = newVal;
    initGame();
  }
});

const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

const gridStyle = computed(() => {
  const level = levels[currentLevel.value] || levels[0];
  return {
    gridTemplateColumns: `repeat(${level.cols}, 1fr)`,
    maxWidth: level.cols > 5 ? '100%' : '600px'
  };
});

const initGame = () => {
  isWin.value = false;
  clearInterval(interval);
  timer.value = 0;
  turns.value = 0;
  lockBoard.value = true;
  firstCard.value = null;

  const numPairs = levels[currentLevel.value].pairs;
  const deck = [...emojis.slice(0, numPairs), ...emojis.slice(0, numPairs)]
    .sort(() => Math.random() - 0.5)
    .map(v => ({ value: v, flipped: true, matched: false }));

  cards.value = deck;

  setTimeout(() => {
    cards.value.forEach(c => c.flipped = false);
    lockBoard.value = false;
    interval = setInterval(() => timer.value++, 1000);
  }, 1200);
};

const flipCard = (i) => {
  if (lockBoard.value || cards.value[i].flipped || cards.value[i].matched) return;

  const emoji = cards.value[i].value;
  const entityId = emojiToId[emoji] || null;
  if (entityId) {
    emit('card-flipped', entityId);
  }

  cards.value[i].flipped = true;

  if (firstCard.value === null) {
    firstCard.value = i;
  } else {
    turns.value++;
    if (cards.value[firstCard.value].value === cards.value[i].value) {
      cards.value[firstCard.value].matched = true;
      cards.value[i].matched = true;
      firstCard.value = null;
      if (cards.value.every(c => c.matched)) endGame();
    } else {
      lockBoard.value = true;
      setTimeout(() => {
        cards.value[firstCard.value].flipped = false;
        cards.value[i].flipped = false;
        firstCard.value = null;
        lockBoard.value = false;
      }, 800);
    }
  }
};

const endGame = async () => {
  clearInterval(interval);
  isWin.value = true;

  try {
    const scoresRef = dbRef(db, 'scores');
    const newScoreRef = push(scoresRef);

    await set(newScoreRef, {
      name: props.userNickname || "Гість",
      time: timer.value,
      turns: turns.value,
      level: currentLevel.value + 1,
      timestamp: Date.now()
    });
    emit('update-leaderboard');
  } catch (e) {
    console.error("Помилка Firebase:", e);
  }
};

const forceQuit = () => {
  if(confirm("Скинути прогрес?")) {
    currentLevel.value = 0;
    emit('level-changed', 0);
    initGame();
  }
};

const nextLevel = () => {
  if (currentLevel.value < 9) {
    currentLevel.value++;
    emit('level-changed', currentLevel.value);
    initGame();
  }
};

initGame();
onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.game-container {
  background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01));
  backdrop-filter: blur(20px);
  padding: 26px;
  border-radius: 28px;
  width: 95vw;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
}
.game-glow {
  position: absolute;
  top: -150px; left: 50%;
  width: 600px; height: 300px;
  margin-left: -300px;
  background: radial-gradient(ellipse, rgba(56,189,248,0.18), transparent 60%);
  pointer-events: none;
  z-index: 0;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.lvl-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #fff;
  padding: 8px 16px;
  border-radius: 50px;
  font-family: 'Unbounded', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 18px rgba(56, 189, 248, 0.4);
}
.lvl-pip {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 8px #fff;
  animation: blink 1.2s ease-in-out infinite;
}
@keyframes blink { 50% { opacity: 0.3; } }

.stats-group {
  display: flex;
  gap: 14px;
}
.s-item {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 6px 14px;
  border-radius: 14px;
  text-align: center;
}
.s-item span {
  font-size: 0.62rem;
  opacity: 0.65;
  display: block;
  letter-spacing: 0.5px;
  font-weight: 600;
}
.s-item strong {
  font-size: 1.05rem;
  color: #7dd3fc;
  font-family: 'Unbounded', sans-serif;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.grid {
  display: grid;
  gap: 10px;
  margin: 0 auto;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.card {
  aspect-ratio: 1/1;
  cursor: pointer;
  width: 100%;
  max-width: 80px;
  position: relative;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-front, .card-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.4rem, 5vw, 2.4rem);
  border-radius: 14px;
  user-select: none;
  overflow: hidden;
  transition:
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.25s ease;
  transform-origin: center center;
  will-change: transform, opacity;
}

/* default: front visible, back hidden */
.card-front { transform: scaleX(1); opacity: 1; }
.card-back  { transform: scaleX(0); opacity: 0; }

/* flipped: back visible, front hidden */
.is-flipped .card-front { transform: scaleX(0); opacity: 0; transition-delay: 0s; }
.is-flipped .card-back  { transform: scaleX(1); opacity: 1; transition-delay: 0.18s; }

.card:hover:not(.is-flipped) .card-front {
  transform: translateY(-2px);
}

.is-matched .card-back {
  animation: matched-pulse 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes matched-pulse {
  0%   { transform: scaleX(1) scale(1); }
  40%  { transform: scaleX(1) scale(1.12); }
  100% { transform: scaleX(1) scale(1); }
}

.card-front {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(56, 165, 233, 0.3) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 4px 14px rgba(0,0,0,0.3);
  position: relative;
}
.card-front::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(56,189,248,0.25), transparent 70%);
  opacity: 0.7;
}
.card-pattern {
  position: absolute;
  inset: 6px;
  border-radius: 10px;
  border: 1px dashed rgba(125, 211, 252, 0.25);
}
.card-mark {
  color: #38bdf8;
  font-family: 'Unbounded', sans-serif;
  font-weight: 800;
  font-size: 1.6rem;
  text-shadow: 0 0 14px rgba(56, 189, 248, 0.7);
  position: relative;
  z-index: 1;
}

.card:hover:not(.is-flipped) .card-front {
  border-color: rgba(125, 211, 252, 0.8) !important;
  box-shadow:
    0 0 20px rgba(56, 189, 248, 0.4),
    inset 0 1px 0 rgba(255,255,255,0.15);
}

.card-back {
  background: linear-gradient(145deg, #ffffff, #e0f2fe);
  color: #000;
  box-shadow:
    inset 0 0 0 2px rgba(56, 189, 248, 0.4),
    0 6px 20px rgba(56, 189, 248, 0.35);
}

.is-matched .card-back {
  background: linear-gradient(145deg, #ecfdf5, #a7f3d0);
  box-shadow:
    inset 0 0 0 2px rgba(34, 197, 94, 0.7),
    0 0 28px rgba(34, 197, 94, 0.55);
}
.is-matched .card-back::after {
  content: '✓';
  position: absolute;
  top: 4px;
  right: 6px;
  font-size: 0.7rem;
  color: #16a34a;
  font-weight: 900;
  text-shadow: 0 0 6px rgba(34, 197, 94, 0.7);
}

.win-banner {
  margin-top: 22px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.18), rgba(56, 189, 248, 0.18));
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 18px;
  padding: 16px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.25);
}
.win-emoji {
  font-size: 2.4rem;
  filter: drop-shadow(0 4px 12px rgba(250, 204, 21, 0.6));
  animation: trophy-bounce 1.2s ease-in-out infinite;
}
@keyframes trophy-bounce {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-4px) rotate(5deg); }
}
.win-banner strong {
  font-family: 'Unbounded', sans-serif;
  font-size: 1rem;
  color: #fff;
  display: block;
}
.win-banner p {
  font-size: 0.82rem;
  opacity: 0.85;
  margin-top: 2px;
}
.win-pop-enter-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.win-pop-enter-from { opacity: 0; transform: scale(0.8) translateY(20px); }

.controls {
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  gap: 12px;
  justify-content: center;
  position: relative;
  z-index: 5;
  background: transparent;
}

button {
  padding: 11px 22px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
  font-family: inherit;
  border: 1px solid transparent;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
button:hover { transform: translateY(-2px); }
button:active { transform: translateY(0); }

.btn-refresh {
  background: rgba(255,255,255,0.05);
  color: #e2e8f0;
  border-color: rgba(255,255,255,0.12);
}
.btn-refresh:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(125,211,252,0.4);
}

.btn-quit {
  background: rgba(239, 68, 68, 0.08);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.25);
}
.btn-quit:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.5);
}

.btn-next {
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(56, 189, 248, 0.4);
  animation: pulse-next 1.6s ease-in-out infinite;
}
.btn-next:hover {
  box-shadow: 0 12px 32px rgba(56, 189, 248, 0.6);
}
@keyframes pulse-next {
  0%, 100% { box-shadow: 0 8px 24px rgba(56, 189, 248, 0.4), 0 0 0 0 rgba(56,189,248,0.5); }
  50% { box-shadow: 0 8px 24px rgba(56, 189, 248, 0.4), 0 0 0 12px rgba(56,189,248,0); }
}

@media (max-width: 500px) {
  .game-container { padding: 16px; border-radius: 22px; }
  .grid { gap: 6px; }
  .card-front, .card-back { border-radius: 10px; }
  .stats-group { gap: 8px; }
  .s-item { padding: 5px 10px; }
  .s-item strong { font-size: 0.95rem; }
  button { padding: 9px 14px; font-size: 0.78rem; }
  .lvl-tag { padding: 6px 12px; font-size: 0.7rem; }
}
</style>
