<template>
  <div class="achievements-container">
    <h3 class="stats-title">Особисті Досягнення</h3>
    
    <div class="badges-grid">
      <div v-for="badge in badges" :key="badge.id" 
           class="badge-card" :class="{ 'locked': !badge.unlocked }">
        <div class="badge-icon">{{ badge.unlocked ? badge.icon : '🔒' }}</div>
        <div class="badge-info">
          <h4>{{ badge.name }}</h4>
          <p>{{ badge.description }}</p>
        </div>
      </div>
    </div>

    <div class="xp-section">
      <div class="xp-header">
        <span>Рівень досвіду: {{ userLevel }}</span>
        <span>{{ totalGames }} ігор зіграно</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" :style="{ width: xpProgress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const scores = ref([]);

const badges = ref([
  { id: 1, name: 'Перша хвиля', description: 'Завершіть свою першу гру', icon: '🌊', condition: (s) => s.length >= 1 },
  { id: 2, name: 'Морський коник', description: 'Пройдіть 5 ігор', icon: '🐎', condition: (s) => s.length >= 5 },
  { id: 3, name: 'Блискавичний дельфін', description: 'Пройдіть рівень швидше ніж за 20 секунд', icon: '🐬', condition: (s) => s.some(i => i.time < 20) },
  { id: 4, name: 'Капітан пам’яті', description: 'Пройдіть 10-й рівень', icon: '👨‍✈️', condition: (s) => s.some(i => i.level === 10) },
  { id: 5, name: 'Глибоководний титан', description: 'Зіграйте 20 ігор', icon: '🦑', condition: (s) => s.length >= 20 },
]);

const loadStats = () => {
  const data = JSON.parse(localStorage.getItem('memoryGameScores') || '[]');
  scores.value = data;
  
  // Перевірка умов для кожного бейджа
  badges.value.forEach(badge => {
    badge.unlocked = badge.condition(scores.value);
  });
};

const totalGames = computed(() => scores.value.length);
const userLevel = computed(() => Math.floor(totalGames.value / 5) + 1);
const xpProgress = computed(() => (totalGames.value % 5) * 20);

onMounted(loadStats);
defineExpose({ refresh: loadStats });
</script>

<style scoped>
.achievements-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  padding: 25px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 20px;
}

.stats-title { color: #7dd3fc; margin-bottom: 20px; text-transform: uppercase; font-size: 1rem; text-align: center; }

.badges-grid { display: grid; gap: 12px; margin-bottom: 25px; }

.badge-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.07);
  padding: 12px;
  border-radius: 16px;
  transition: 0.3s;
}

.badge-card.locked { opacity: 0.4; filter: grayscale(1); }
.badge-icon { font-size: 1.8rem; }
.badge-info h4 { font-size: 0.9rem; color: #fff; margin-bottom: 2px; }
.badge-info p { font-size: 0.75rem; color: #94a3b8; }

.xp-section { margin-top: 10px; }
.xp-header { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 8px; color: #38bdf8; }

.progress-bar-bg { background: rgba(255, 255, 255, 0.1); height: 8px; border-radius: 4px; overflow: hidden; }
.progress-bar-fill { 
  background: linear-gradient(90deg, #0ea5e9, #7dd3fc); 
  height: 100%; 
  transition: width 0.5s ease-out; 
}
</style>