<template>
  <div class="stats-wrapper">
    <div class="stats-card user-main-info">
      <div class="card-shine"></div>
      <h3 class="section-title">Досягнення</h3>

      <div class="xp-info">
        <div class="level-badge">
          <span class="level-spark">✦</span>
          Рівень {{ userLevel }}
        </div>
        <div class="xp-text">Прогрес</div>
      </div>

      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: xpPercentage + '%' }">
            <div class="progress-shine"></div>
          </div>
        </div>
        <span class="percentage-label">{{ Math.round(xpPercentage) }}%</span>
      </div>
      <p class="games-count">Моїх ігор: <strong>{{ personalScores.length }}</strong></p>
    </div>

    <div class="stats-card badges-section">
      <h4 class="mini-title">Ваші нагороди</h4>
      <div class="badges-grid">
        <div
          v-for="badge in badges"
          :key="badge.id"
          class="badge-item"
          :class="{ 'is-locked': !badge.unlocked }"
          :title="badge.description"
        >
          <div class="badge-icon-wrap">
            <div class="badge-icon">{{ badge.unlocked ? badge.icon : '🔒' }}</div>
            <div v-if="badge.unlocked" class="badge-ring"></div>
          </div>
          <span class="badge-name">{{ badge.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineExpose, defineProps } from 'vue';
import { db, ref as dbRef, onValue } from '../firebase.js';

const props = defineProps({
  userNickname: { type: String, default: '' }
});

const scores = ref([]);

const personalScores = computed(() => {
  const nickname = props.userNickname || localStorage.getItem('savedPlayerName') || '';
  if (!nickname) return [];
  return scores.value.filter(s => s.name === nickname);
});

const badges = ref([
  { id: 1, name: 'Перший крок', icon: '🌊', description: 'Зіграно 5 особистих ігор', unlocked: false, condition: (s) => s.length >= 5 },
  { id: 2, name: 'Спринтер', icon: '🐬', description: 'Зіграно 10 особистих ігор', unlocked: false, condition: (s) => s.length >= 10 },
  { id: 3, name: 'Дослідник', icon: '🔱', description: 'Зіграно 20 особистих ігор', unlocked: false, condition: (s) => s.length >= 20 },
  { id: 4, name: 'Майстер', icon: '🦈', description: 'Зіграно 50 особистих ігор', unlocked: false, condition: (s) => s.length >= 50 }
]);

const refreshStats = () => {
  const scoresPath = dbRef(db, 'scores');
  onValue(scoresPath, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      scores.value = list;
      badges.value.forEach(b => {
        b.unlocked = b.condition(personalScores.value);
      });
    } else {
      scores.value = [];
      badges.value.forEach(b => b.unlocked = false);
    }
  });
};

const userLevel = computed(() => Math.floor(personalScores.value.length / 5) + 1);
const xpPercentage = computed(() => (personalScores.value.length % 5) * 20);

onMounted(refreshStats);
defineExpose({ refresh: refreshStats });
</script>

<style scoped>
.stats-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.stats-card {
  background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01));
  backdrop-filter: blur(20px);
  border-radius: 22px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0,0,0,0.25);
}

.user-main-info .card-shine {
  position: absolute;
  top: -50%;
  right: -30%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(125,211,252,0.18), transparent 70%);
  pointer-events: none;
}

.section-title {
  font-family: 'Unbounded', sans-serif;
  color: #fff;
  font-size: 0.95rem;
  text-transform: uppercase;
  margin-bottom: 18px;
  text-align: center;
  letter-spacing: 1.5px;
  position: relative;
}
.section-title::after {
  content: '';
  display: block;
  width: 32px;
  height: 2px;
  background: linear-gradient(90deg, var(--cyan, #38bdf8), var(--indigo, #6366f1));
  margin: 8px auto 0;
  border-radius: 2px;
}

.xp-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #fff;
  padding: 5px 14px;
  border-radius: 50px;
  font-family: 'Unbounded', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.3px;
  box-shadow: 0 6px 18px rgba(56, 189, 248, 0.35);
}
.level-spark {
  font-size: 0.7rem;
  animation: spark-twinkle 1.6s ease-in-out infinite;
}
@keyframes spark-twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.xp-text {
  font-size: 0.75rem;
  opacity: 0.65;
  letter-spacing: 0.3px;
}

.progress-container {
  position: relative;
  z-index: 1;
}

.progress-bar {
  background: rgba(0, 0, 0, 0.35);
  height: 10px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 8px;
  border: 1px solid rgba(255,255,255,0.04);
  position: relative;
}

.progress-fill {
  background: linear-gradient(90deg, #38bdf8, #6366f1, #a855f7);
  background-size: 200% 100%;
  height: 100%;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-radius: 8px;
  animation: gradient-shift 4s ease-in-out infinite;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
}
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.progress-shine {
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: progress-shine 2.5s infinite;
}
@keyframes progress-shine {
  to { left: 200%; }
}

.percentage-label {
  font-family: 'Unbounded', sans-serif;
  font-size: 0.75rem;
  color: #7dd3fc;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.games-count {
  font-size: 0.72rem;
  opacity: 0.6;
  margin-top: 8px;
  text-align: center;
  position: relative;
  z-index: 1;
}
.games-count strong {
  color: #7dd3fc;
  font-weight: 700;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.badge-item {
  background: rgba(255, 255, 255, 0.02);
  padding: 16px 10px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.badge-item:not(.is-locked) {
  background: linear-gradient(145deg, rgba(56, 189, 248, 0.12), rgba(99, 102, 241, 0.05));
  border-color: rgba(125, 211, 252, 0.3);
  box-shadow: 0 6px 18px rgba(56, 189, 248, 0.15);
}
.badge-item:not(.is-locked):hover {
  transform: translateY(-4px);
  border-color: rgba(125, 211, 252, 0.6);
  box-shadow: 0 12px 28px rgba(56, 189, 248, 0.3);
}

.is-locked {
  opacity: 0.3;
  filter: grayscale(1);
}

.badge-icon-wrap {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.badge-icon {
  font-size: 1.9rem;
  filter: drop-shadow(0 2px 8px rgba(56, 189, 248, 0.4));
  position: relative;
  z-index: 1;
}
.badge-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px dashed rgba(125, 211, 252, 0.5);
  animation: spin 12s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.badge-name {
  font-size: 0.7rem;
  font-weight: 700;
  text-align: center;
  color: #fff;
  letter-spacing: 0.2px;
}

.mini-title {
  font-family: 'Unbounded', sans-serif;
  font-size: 0.78rem;
  margin-bottom: 16px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.7);
}
</style>
