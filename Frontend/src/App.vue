<template>
  <div id="app">
    <!-- ANIMATED BACKGROUND LAYERS -->
    <div class="bg-layer">
      <div class="aurora aurora-1"></div>
      <div class="aurora aurora-2"></div>
      <div class="aurora aurora-3"></div>
      <div class="grid-overlay"></div>
      <div class="bubbles">
        <span v-for="n in 18" :key="n" :style="bubbleStyle(n)"></span>
      </div>
      <div class="cursor-glow" :style="cursorStyle"></div>
    </div>

    <!-- LOGIN MODAL -->
    <transition name="fade-scale">
      <div v-if="!playerName" class="login-overlay">
        <div class="login-modal">
          <div class="login-icon-wrap">
            <div class="login-icon">🌊</div>
            <div class="login-icon-ring"></div>
          </div>
          <h2>Вітаємо у «Морській Пам'яті»</h2>
          <p>Введіть своє ім'я для участі в онлайн-рейтингу та відстеження досягнень</p>
          <input
            v-model="tempName"
            @keyup.enter="saveName"
            placeholder="Ваш нікнейм..."
            maxlength="15"
          />
          <button @click="saveName">
            <span>Почати гру</span>
            <span class="btn-shine"></span>
          </button>
        </div>
      </div>
    </transition>

    <!-- HEADER -->
    <header class="main-header">
      <div class="header-eyebrow">
        <span class="dot-live"></span>
        <span>Онлайн рейтинг · Реальний час</span>
      </div>
      <h1 data-text="Морська Пам'ять">Морська Пам'ять</h1>
      <p class="header-sub">Гра-тренажер для мозку з науковим підходом</p>

      <div class="benefits-container">
        <div class="benefit-card">
          <div class="card-glow"></div>
          <div class="card-num">01</div>
          <h3>Нейропластичність</h3>
          <p>
            "Гра на пам'ять" базується на принципах нейропластичності — здатності мозку формувати
            нові нейронні зв'язки у відповідь на когнітивні виклики. Регулярні тренування активують
            префронтальну кору головного мозку, яка відповідає за робочу пам'ять та здатність до
            концентрації. Це не просто розвага, а науково обґрунтований метод підтримки когнітивного
            здоров'я, що сприяє швидшому засвоєнню нової інформації та підвищенню швидкості
            прийняття критичних рішень у повсякденному житті.
          </p>
        </div>
        <div class="benefit-card">
          <div class="card-glow"></div>
          <div class="card-num">02</div>
          <h3>Механізми покращення</h3>
          <p>
            Під час пошуку парних об'єктів мозок задіює складні механізми візуального кодування та
            активного пригадування (active recall). Використання морської тематики та різноманітних
            іконок стимулює селективну увагу — здатність фокусуватися на важливому, ігноруючи
            другорядні подразники. Згідно з дослідженнями в галузі нейропсихології, щоденні
            15-хвилинні сесії таких вправ допомагають знизити рівень когнітивної втоми та підвищити
            загальну продуктивність інтелектуальної праці на 20–30%.
          </p>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="content-wrapper">
      <!-- LEFT SIDEBAR -->
      <aside class="left-sidebar">
        <Leaderboard ref="leaderboardComponent" />
        <GameStats ref="gameStatsComponent" :userNickname="playerName" />
      </aside>

      <!-- CENTER COLUMN -->
      <div class="center-column">
        <!-- LEVELS BAR -->
        <div class="levels-bar">
          <span class="levels-label">Рівень</span>
          <div class="levels-track">
            <button
              v-for="n in 10"
              :key="n"
              @click="selectLevel(n - 1)"
              :class="['level-btn', { 'level-active': currentLevel === n - 1 }]"
            >
              {{ n }}
            </button>
          </div>
        </div>

        <!-- GAME AREA -->
        <div class="game-area">
          <MemoryGame
            :manualLevel="currentLevel"
            :userNickname="playerName"
            @update-leaderboard="refreshData"
            @level-changed="syncLevel"
            @card-flipped="handleCardFlip"
          />
        </div>

        <!-- ENCYCLOPEDIA -->
        <div class="encyclopedia-wrapper">
          <MarineEncyclopedia :entityId="selectedEntityId" />
        </div>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="expert-section">
      <div class="section-tag">Експертно</div>
      <h2>Експертні методики тренування мозку</h2>
      <div class="expert-grid">
        <div class="expert-card">
          <div class="expert-icon">🧠</div>
          <h4>Таблиці Шульте</h4>
          <p>
            Робота з таблицями Шульте є базовою вправою для розвитку навичок швидкого читання. Вона
            тренує здатність сприймати великі об'єми візуальної інформації одночасно, без
            необхідності фокусуватися на кожному окремому елементі. Це дозволяє мозку миттєво
            знаходити потрібні дані в тексті або складному інтерфейсі, значно економлячи час та
            енергію.
          </p>
        </div>
        <div class="expert-card">
          <div class="expert-icon">🏛️</div>
          <h4>Метод Локусів</h4>
          <p>
            Ця методика базується на здатності мозку ідеально запам'ятовувати просторові зв'язки.
            Ви подумки розміщуєте об'єкти, які потрібно запам'ятати, у добре знайомому приміщенні.
            Використання асоціативного мислення дозволяє зберігати в пам'яті величезні масиви
            неструктурованих даних — переводячи їх із короткочасної пам'яті в довготривалу.
          </p>
        </div>
        <div class="expert-card">
          <div class="expert-icon">⚡</div>
          <h4>N-назад (Dual N-Back)</h4>
          <p>
            Dual N-Back — це єдина методика, ефективність якої в підвищенні рівня рухомого
            інтелекту науково доведена вченими Мічиганського університету. Вправа змушує мозок
            одночасно оперувати кількома потоками інформації, що постійно змінюються, та збільшує
            щільність нейронних мереж у лобовій частині мозку.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import MemoryGame from './components/MemoryGame.vue';
import Leaderboard from './components/Leaderboard.vue';
import GameStats from './components/GameStats.vue';
import MarineEncyclopedia from './components/MarineEncyclopedia.vue';
import { db, ref as dbRef, onValue } from './firebase.js';

const selectedEntityId = ref(null);
const currentLevel = ref(0);
const leaderboardComponent = ref(null);
const gameStatsComponent = ref(null);

const playerName = ref(localStorage.getItem('savedPlayerName') || '');
const tempName = ref('');

const mouseX = ref(50);
const mouseY = ref(50);

const handleCardFlip = (iconName) => {
  selectedEntityId.value = iconName;
};

const saveName = () => {
  if (tempName.value.trim().length > 1) {
    playerName.value = tempName.value.trim();
    localStorage.setItem('savedPlayerName', playerName.value);
  }
};

const selectLevel = (index) => {
  currentLevel.value = index;
};

const syncLevel = (newLevel) => {
  currentLevel.value = newLevel;
};

const refreshData = () => {
  if (leaderboardComponent.value?.fetchScores) {
    leaderboardComponent.value.fetchScores();
  }
  if (gameStatsComponent.value?.refresh) {
    gameStatsComponent.value.refresh();
  }
};

const bubbleStyle = (n) => {
  const seed = n * 37;
  const left = (seed * 13) % 100;
  const size = 10 + ((seed * 7) % 35);
  const dur = 12 + ((seed * 3) % 18);
  const delay = (seed % 20);
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${dur}s`,
    animationDelay: `-${delay}s`,
  };
};

const cursorStyle = ref({ transform: 'translate3d(0,0,0)' });

const onMouseMove = (e) => {
  cursorStyle.value = {
    transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
  };
};

onMounted(() => {
  const scoresBus = dbRef(db, 'scores');
  onValue(scoresBus, () => {
    refreshData();
  });
  window.addEventListener('mousemove', onMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@600;700;800;900&display=swap');

/* ─── RESET ─────────────────────────────────────────── */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  overflow-x: hidden;
}

:root {
  --aqua: #5eead4;
  --aqua-deep: #14b8a6;
  --cyan: #38bdf8;
  --cyan-bright: #7dd3fc;
  --indigo: #6366f1;
  --violet: #a855f7;
  --pink: #f472b6;
  --night: #020617;
  --night-2: #0b1226;
  --ink: #e2e8f0;
  --glass: rgba(255, 255, 255, 0.06);
  --glass-border: rgba(255, 255, 255, 0.12);
  --shadow-1: 0 8px 32px rgba(2, 6, 23, 0.45);
  --shadow-glow: 0 0 40px rgba(56, 189, 248, 0.25);
}

html { background: #02040d; }

body {
  background: transparent;
  color: var(--ink);
  font-family: 'Space Grotesk', sans-serif;
  min-height: 100vh;
  position: relative;
}

/* ─── CUSTOM SCROLLBAR ─── */
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--cyan), var(--indigo));
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--cyan-bright), var(--violet));
  background-clip: padding-box;
}

::selection { background: rgba(56, 189, 248, 0.35); color: #fff; }

/* ─── ANIMATED BACKGROUND LAYERS ─── */
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 60% at 20% 0%, rgba(56, 189, 248, 0.18), transparent 60%),
    radial-gradient(ellipse 70% 50% at 80% 30%, rgba(168, 85, 247, 0.15), transparent 60%),
    radial-gradient(ellipse 60% 70% at 50% 100%, rgba(20, 184, 166, 0.15), transparent 60%),
    radial-gradient(ellipse at top, #0e1c3a 0%, #050a1c 45%, #02040d 100%);
}

#app { position: relative; z-index: 1; }

.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.85;
  mix-blend-mode: screen;
  animation: drift 22s ease-in-out infinite;
}
.aurora-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.7) 0%, rgba(14, 165, 233, 0.1) 50%, transparent 75%);
  top: -15%; left: -10%;
}
.aurora-2 {
  width: 820px; height: 820px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 75%);
  top: 20%; right: -20%;
  animation-delay: -7s;
}
.aurora-3 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(20, 184, 166, 0.55) 0%, rgba(20, 184, 166, 0.08) 50%, transparent 75%);
  bottom: -10%; left: 25%;
  animation-delay: -14s;
}
.aurora-1, .aurora-2, .aurora-3 { will-change: transform; }

@keyframes drift {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(80px, -60px) scale(1.15); }
  66% { transform: translate(-60px, 70px) scale(0.9); }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(125, 211, 252, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(125, 211, 252, 0.07) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
  opacity: 0.7;
}

.bubbles { position: absolute; inset: 0; }
.bubbles span {
  position: absolute;
  bottom: -50px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(125,211,252,0.2) 60%, transparent 80%);
  border: 1px solid rgba(125, 211, 252, 0.4);
  box-shadow:
    inset 0 0 12px rgba(255,255,255,0.3),
    0 0 18px rgba(125, 211, 252, 0.25);
  animation: rise linear infinite;
  opacity: 0;
}
@keyframes rise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.9; }
  90% { opacity: 0.7; }
  100% { transform: translateY(-110vh) translateX(50px); opacity: 0; }
}

.cursor-glow {
  position: fixed;
  top: -200px;
  left: -200px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(125, 211, 252, 0.12) 0%, transparent 60%);
  pointer-events: none;
  margin-left: -200px;
  margin-top: -200px;
  will-change: transform;
  transition: transform 0.08s linear;
}

/* ─── ROOT ──────────────────────────────────────────── */
#app {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px 0;
  position: relative;
}

/* ─── LOGIN MODAL ───────────────────────────────────── */
.fade-scale-enter-active, .fade-scale-leave-active { transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
.fade-scale-enter-from, .fade-scale-leave-to { opacity: 0; transform: scale(0.95); }

.login-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.login-modal {
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(9, 15, 35, 0.98));
  padding: 52px 44px;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  text-align: center;
  max-width: 440px;
  width: 90%;
  box-shadow:
    0 30px 80px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.15);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.login-modal::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 32px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(125,211,252,0.5), transparent 50%, rgba(168,85,247,0.3)); 
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.login-icon-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-icon {
  font-size: 2.8rem;
  filter: drop-shadow(0 6px 16px rgba(56, 189, 248, 0.6));
  animation: float-soft 4s ease-in-out infinite;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-icon-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px dashed rgba(125, 211, 252, 0.4);
  animation: spin 12s linear infinite;
}
@keyframes float-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes spin { to { transform: rotate(360deg); } }

.login-modal h2 {
  font-family: 'Unbounded', sans-serif;
  background: linear-gradient(135deg, #fff 0%, var(--cyan-bright) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 14px;
  font-size: 1.5rem;
  font-weight: 800;
}

.login-modal p {
  font-size: 0.92rem;
  margin-bottom: 28px;
  opacity: 0.7;
  line-height: 1.55;
}

.login-modal input {
  width: 100%;
  padding: 14px 20px;
  border-radius: 50px;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  margin-bottom: 20px;
  font-family: inherit;
  font-size: 1.05rem;
  text-align: center;
  transition: all 0.25s;
}
.login-modal input::placeholder { color: rgba(255, 255, 255, 0.4); }
.login-modal input:focus {
  outline: none;
  border-color: var(--cyan);
  background: rgba(56, 189, 248, 0.08);
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15);
}

.login-modal button {
  background: linear-gradient(135deg, var(--cyan) 0%, var(--indigo) 100%);
  color: #fff;
  border: none;
  padding: 14px 40px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 8px 24px rgba(56, 189, 248, 0.35);
  position: relative;
  overflow: hidden;
  font-family: inherit;
}
.login-modal button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(56, 189, 248, 0.5);
}
.btn-shine {
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shine 3s infinite;
}
@keyframes shine {
  to { left: 200%; }
}

/* ─── HEADER ────────────────────────────────────────── */
.main-header {
  width: 100%;
  max-width: 1400px;
  text-align: center;
  margin-bottom: 56px;
}

.header-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 7px 16px;
  border-radius: 50px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  font-size: 0.78rem;
  letter-spacing: 0.5px;
  color: var(--cyan-bright);
  margin-bottom: 24px;
}
.dot-live {
  width: 8px; height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 10px #22c55e;
  animation: pulse-dot 1.6s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

.main-header h1 {
  font-family: 'Unbounded', sans-serif;
  font-size: clamp(1.8rem, 8vw, 5.5rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 18px;
  background: linear-gradient(180deg, #ffffff 30%, #7dd3fc 70%, #6366f1 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 8px 24px rgba(56, 189, 248, 0.35));
  position: relative;
}

.header-sub {
  font-size: 1.05rem;
  opacity: 0.65;
  margin-bottom: 48px;
  letter-spacing: 0.3px;
}

/* ─── BENEFIT CARDS ─────────────────────────────────── */
.benefits-container {
  display: flex;
  gap: 22px;
  width: 100%;
}

.benefit-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
  padding: 32px 32px 28px;
  border-radius: 28px;
  flex: 1;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-align: left;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(125, 211, 252, 0.15) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}

.benefit-card:hover {
  transform: translateY(-4px);
  border-color: rgba(125, 211, 252, 0.3);
  box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(125,211,252,0.1);
}
.benefit-card:hover .card-glow { opacity: 1; }

.card-num {
  font-family: 'Unbounded', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--cyan);
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.benefit-card h3 {
  font-family: 'Unbounded', sans-serif;
  color: #fff;
  margin-bottom: 16px;
  font-size: 1.25rem;
  font-weight: 700;
}

.benefit-card p {
  font-size: 0.92rem;
  line-height: 1.7;
  opacity: 0.78;
  text-align: justify;
}

/* ─── MAIN LAYOUT ───────────────────────────────────── */
.content-wrapper {
  display: flex;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 1400px;
  margin-bottom: 80px;
}

.left-sidebar {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 340px;
  max-width: 380px;
  flex-shrink: 0;
  position: sticky;
  top: 20px;
}

.center-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  flex: 1;
  min-width: 0;
  max-width: 820px;
}

/* ─── LEVELS BAR ────────────────────────────────────── */
.levels-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
  padding: 14px 24px;
  border-radius: 50px;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
}

.levels-label {
  font-family: 'Unbounded', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  color: var(--cyan-bright);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  white-space: nowrap;
}

.levels-track {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.level-btn {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1.5px solid rgba(125, 211, 252, 0.2);
  color: #fff;
  font-weight: 700;
  font-size: 0.88rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.level-btn:hover {
  background: rgba(125, 211, 252, 0.12);
  border-color: rgba(125, 211, 252, 0.6);
  transform: translateY(-2px);
}
.level-active {
  background: linear-gradient(135deg, var(--cyan) 0%, var(--indigo) 100%) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 24px rgba(56, 189, 248, 0.6), inset 0 1px 0 rgba(255,255,255,0.3);
  transform: translateY(-2px) scale(1.05);
  color: #fff;
}

.game-area {
  width: 100%;
  display: flex;
  justify-content: center;
}

.encyclopedia-wrapper {
  width: 100%;
  position: static;
  flex-shrink: 0;
}

/* ─── EXPERT FOOTER ─────────────────────────────────── */
.expert-section {
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 80px;
}

.section-tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 50px;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: var(--cyan-bright);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.expert-section h2 {
  font-family: 'Unbounded', sans-serif;
  background: linear-gradient(180deg, #fff 30%, var(--cyan-bright) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 44px;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.01em;
}

.expert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 22px;
  width: 100%;
  max-width: 1200px;
}

.expert-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
  padding: 32px 28px;
  border-radius: 24px;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(14px);
  position: relative;
  overflow: hidden;
}
.expert-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(125,211,252,0.4), transparent);
}
.expert-card:hover {
  transform: translateY(-6px);
  border-color: rgba(125, 211, 252, 0.25);
  box-shadow: 0 24px 60px rgba(0,0,0,0.4);
}

.expert-icon {
  font-size: 2.2rem;
  margin-bottom: 14px;
  display: inline-block;
  filter: drop-shadow(0 4px 12px rgba(56, 189, 248, 0.4));
}

.expert-card h4 {
  font-family: 'Unbounded', sans-serif;
  color: #fff;
  margin-bottom: 14px;
  font-size: 1.15rem;
  font-weight: 700;
}

.expert-card p {
  font-size: 0.9rem;
  opacity: 0.78;
  line-height: 1.7;
  text-align: justify;
}

/* ─── RESPONSIVE ────────────────────────────────────── */
@media (max-width: 1100px) {
  .content-wrapper {
    flex-direction: column;
    align-items: center;
  }
  .left-sidebar {
    position: static;
    width: 100%;
    max-width: 640px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  .center-column { max-width: 100%; width: 100%; }
  .benefits-container { flex-direction: column; }
}

@media (max-width: 600px) {
  #app { padding: 20px 10px 0; }
  
  /* Centering header & headings */
  .main-header h1 {
    font-size: clamp(1.8rem, 8vw, 3.5rem) !important;
    word-break: break-word;
  }
  .header-sub {
    font-size: 0.95rem;
    padding: 0 10px;
    text-align: center;
    line-height: 1.5;
  }

  /* Centering card texts and ensuring visibility */
  .benefit-card {
    text-align: center !important;
    padding: 24px 20px 20px !important;
    border-radius: 20px !important;
  }
  .benefit-card p {
    text-align: center !important;
    font-size: 0.88rem !important;
    line-height: 1.6 !important;
  }
  
  .expert-card {
    text-align: center !important;
    padding: 24px 20px !important;
    border-radius: 20px !important;
  }
  .expert-card p {
    text-align: center !important;
    font-size: 0.88rem !important;
    line-height: 1.6 !important;
  }

  /* Centering left sidebar components */
  .left-sidebar { 
    flex-direction: column !important; 
    align-items: center !important;
    width: 100% !important;
  }
  
  .levels-bar { 
    padding: 10px 14px !important; 
    gap: 8px !important; 
    border-radius: 25px !important;
  }
  .level-btn { 
    width: 32px !important; 
    height: 32px !important; 
    font-size: 0.78rem !important; 
    border-radius: 10px !important; 
  }
  .levels-label {
    width: 100%;
    text-align: center;
    margin-bottom: 4px;
  }

  /* Encyclopedia mobile styling */
  .marine-encyclopedia {
    padding: 24px 20px !important;
    border-radius: 20px !important;
    text-align: center !important;
  }
  .marine-encyclopedia p {
    text-align: center !important;
    font-size: 0.92rem !important;
    line-height: 1.6 !important;
  }
  .encyclopedia-header {
    flex-direction: column !important;
    align-items: center !important;
    gap: 12px !important;
  }
  .eco-icon-wrap {
    margin: 0 auto;
  }

  /* Game Mobile styling scales card text */
  .card-front, .card-back {
    font-size: clamp(1.2rem, 6vw, 2rem) !important;
  }
  .card-mark {
    font-size: 1.3rem !important;
  }
  
  .cursor-glow { display: none !important; }
}
</style>
