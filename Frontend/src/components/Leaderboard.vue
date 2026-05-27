<template>
  <div class="leaderboard-box">
    <div class="lb-header">
      <div class="lb-title-wrap">
        <span class="lb-trophy">🏆</span>
        <h3>Топ Гравців</h3>
      </div>
      <span class="lb-count">{{ scores.length }}</span>
    </div>

    <div class="table-wrapper" v-if="scores.length > 0">
      <div v-for="(score, index) in scores" :key="score.id" class="row"
           :class="{ 'row-gold': index === 0, 'row-silver': index === 1, 'row-bronze': index === 2 }">
        <div class="rank">
          <span v-if="index === 0">🥇</span>
          <span v-else-if="index === 1">🥈</span>
          <span v-else-if="index === 2">🥉</span>
          <span v-else class="rank-num">{{ index + 1 }}</span>
        </div>
        <div class="score-name" :title="score.name">{{ score.name }}</div>
        <span class="lb-level-badge">Lvl {{ score.level || 1 }}</span>
        <div class="score-time">
          <strong>{{ score.time }}</strong><span>с</span>
        </div>
        <button @click="deleteScore(score.id, score.name)" class="btn-delete" title="Видалити">×</button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🌊</div>
      <p>Поки що порожньо.<br>Стань першим!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue';
import { db, ref as dbRef, onValue, set } from '../firebase.js';

const scores = ref([]);

const fetchScores = () => {
  const scoresPath = dbRef(db, 'scores');
  onValue(scoresPath, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      
      // Фільтруємо список, залишаючи тільки найкращий результат для кожного унікального гравця
      const bestScoresMap = {};
      list.forEach(item => {
        const name = (item.name || "Гість").trim();
        const level = Number(item.level) || 1;
        const time = Number(item.time) || 999999;
        const turns = Number(item.turns) || 999999;
        
        if (!bestScoresMap[name]) {
          bestScoresMap[name] = item;
        } else {
          const existing = bestScoresMap[name];
          const exLevel = Number(existing.level) || 1;
          const exTime = Number(existing.time) || 999999;
          const exTurns = Number(existing.turns) || 999999;
          
          let isBetter = false;
          if (level > exLevel) {
            isBetter = true; // Вищий рівень краще
          } else if (level === exLevel) {
            if (time < exTime) {
              isBetter = true; // Менший час краще
            } else if (time === exTime && turns < exTurns) {
              isBetter = true; // Менше ходів краще
            }
          }
          
          if (isBetter) {
            bestScoresMap[name] = item;
          }
        }
      });
      
      const uniqueList = Object.values(bestScoresMap);
      
      // Сортуємо: вищий рівень спочатку, при рівності — менший час, далі менше ходів
      scores.value = uniqueList
        .sort((a, b) => {
          const levelA = Number(a.level) || 1;
          const levelB = Number(b.level) || 1;
          if (levelB !== levelA) return levelB - levelA;
          
          const timeA = Number(a.time) || 999999;
          const timeB = Number(b.time) || 999999;
          if (timeA !== timeB) return timeA - timeB;
          
          const turnsA = Number(a.turns) || 999999;
          const turnsB = Number(b.turns) || 999999;
          return turnsA - turnsB;
        })
        .slice(0, 10);
    } else {
      scores.value = [];
    }
  }, (error) => {
    console.error("Помилка Firebase:", error);
  });
};

const deleteScore = async (id, name) => {
  const password = prompt(`Введіть адмін-пароль для видалення гравця "${name}":`);
  if (password === '1111') {
    try {
      const scoresPath = dbRef(db, 'scores');
      const unsubscribe = onValue(scoresPath, async (snapshot) => {
        unsubscribe(); // Відразу скасовуємо підписку, щоб уникнути зациклювання при видаленні
        const data = snapshot.val();
        if (data) {
          const deletePromises = [];
          Object.keys(data).forEach(key => {
            if ((data[key].name || "Гість").trim() === name.trim()) {
              const scoreRef = dbRef(db, `scores/${key}`);
              deletePromises.push(set(scoreRef, null));
            }
          });
          
          await Promise.all(deletePromises);
          alert(`Всі записи гравця "${name}" успішно видалено!`);
        }
      });
    } catch (e) {
      console.error(e);
      alert("Помилка видалення");
    }
  } else if (password !== null) {
    alert("Невірний пароль!");
  }
};

onMounted(fetchScores);
defineExpose({ fetchScores });
</script>

<style scoped>
.leaderboard-box {
  background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01));
  backdrop-filter: blur(20px);
  padding: 22px;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 12px 36px rgba(0,0,0,0.3);
  position: relative;
  overflow: hidden;
}
.leaderboard-box::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(125,211,252,0.5), transparent);
}

.lb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.lb-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.lb-trophy {
  font-size: 1.3rem;
  filter: drop-shadow(0 2px 6px rgba(250, 204, 21, 0.5));
}
h3 {
  font-family: 'Unbounded', sans-serif;
  color: #fff;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  font-weight: 700;
}
.lb-count {
  background: rgba(56, 189, 248, 0.15);
  color: #7dd3fc;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row {
  display: grid;
  grid-template-columns: 32px 1fr auto auto 26px;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 12px;
  transition: all 0.25s;
}
.row:hover {
  background: rgba(125, 211, 252, 0.06);
  border-color: rgba(125, 211, 252, 0.2);
  transform: translateX(2px);
}

.row-gold {
  background: linear-gradient(90deg, rgba(250, 204, 21, 0.12), rgba(250, 204, 21, 0.02));
  border-color: rgba(250, 204, 21, 0.3);
}
.row-silver {
  background: linear-gradient(90deg, rgba(203, 213, 225, 0.1), rgba(203, 213, 225, 0.02));
  border-color: rgba(203, 213, 225, 0.25);
}
.row-bronze {
  background: linear-gradient(90deg, rgba(251, 146, 60, 0.1), rgba(251, 146, 60, 0.02));
  border-color: rgba(251, 146, 60, 0.25);
}

.rank {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
}
.rank-num {
  font-family: 'Unbounded', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(255,255,255,0.45);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.03);
  border-radius: 8px;
}

.score-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  color: #e2e8f0;
  font-size: 0.9rem;
}

.score-time {
  font-family: 'Unbounded', sans-serif;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.score-time strong {
  color: #7dd3fc;
  font-size: 0.92rem;
  font-weight: 700;
}
.score-time span {
  font-size: 0.7rem;
  opacity: 0.5;
  margin-left: 2px;
}

.btn-delete {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #f87171;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  line-height: 1;
  opacity: 0.4;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.btn-delete:hover {
  opacity: 1;
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  transform: scale(1.05);
}

.empty-state {
  text-align: center;
  padding: 28px 12px;
  opacity: 0.6;
}
.empty-icon {
  font-size: 2.4rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 10px rgba(56, 189, 248, 0.3));
  animation: float-soft 4s ease-in-out infinite;
}
.empty-state p {
  font-size: 0.85rem;
  line-height: 1.4;
}

@keyframes float-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.lb-level-badge {
  font-size: 0.65rem;
  background: rgba(56, 189, 248, 0.15);
  color: #7dd3fc;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 1px 6px;
  border-radius: 6px;
  margin-left: 6px;
  font-weight: 700;
  vertical-align: middle;
  display: inline-block;
}

@media (max-width: 480px) {
  .leaderboard-box { padding: 18px; }
  .row { padding: 8px 10px; gap: 8px; }
  .score-name { font-size: 0.85rem; }
}
</style>
