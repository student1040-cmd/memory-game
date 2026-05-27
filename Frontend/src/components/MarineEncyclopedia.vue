<template>
  <transition name="slide-up" mode="out-in">
    <section v-if="entity" class="marine-encyclopedia" :key="entity.title">
      <div class="enc-glow"></div>
      <div class="encyclopedia-content">
        <div class="encyclopedia-header">
          <span class="eco-badge">
            <span class="eco-badge-dot"></span>
            Енциклопедія
          </span>
          <div class="eco-icon-wrap">
            <div class="eco-icon">{{ getIcon(props.entityId) }}</div>
            <div class="eco-icon-ring"></div>
          </div>
          <h2>{{ entity.title }}</h2>
        </div>
        <p>{{ entity.text }}</p>
      </div>
    </section>

    <section v-else class="marine-encyclopedia placeholder" key="placeholder">
      <div class="ph-icon">🔍</div>
      <p>Оберіть морську істоту в грі, щоб розкрити її таємниці</p>
    </section>
  </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  entityId: { type: String, default: null }
});

const marineLibrary = {
  'dolphin': { title: 'Дельфін', text: 'Дельфіни — одні з найрозумніших істот. Вони мають унікальні імена-свистки для кожного члена зграї.' },
  'whale': { title: 'Кит', text: 'Синій кит — найбільша тварина в історії Землі. Його серце розміром з автомобіль.' },
  'octopus': { title: 'Восьминіг', text: 'У восьминога три серця і блакитна кров. Вони майстри маскування і дуже кмітливі.' },
  'squid': { title: 'Кальмар', text: 'Гігантські кальмари мають найбільші очі серед усіх тварин — розміром з футбольний м’яч.' },
  'crab': { title: 'Краб', text: 'Краби існують на Землі понад 200 мільйонів років. Вони спілкуються, постукуючи клешнями.' },
  'pufferfish': { title: 'Риба-фугу', text: 'При небезпеці вона роздувається в кулю. Її отрута дуже небезпечна, але вона вважається делікатесом.' },
  'fish': { title: 'Рибка', text: 'Коралові риби мають яскраве забарвлення, щоб ховатися серед різнокольорових рифів.' },
  'shark': { title: 'Акула', text: 'Акули не мають кісток — їхній скелет із хрящів. Вони чудово відчувають здобич здалеку.' },
  'shell': { title: 'Мушля', text: 'Мушлі — це "будиночки" молюсків. Шум у них — це звук відлуння навколишнього середовища.' },
  'ship': { title: 'Корабель', text: 'Перші вітрильники з’явилися тисячі років тому. Сьогодні вони перевозять вантажі по всьому світу.' },
  'island': { title: 'Острів', text: 'Острови часто є вершинами підводних вулканів. Найбільший острів світу — Гренландія.' },
  'mermaid': { title: 'Русалка', text: 'Легенди про русалок існують усюди. Моряки часто плутали з ними морських корів.' },
  'penguin': { title: 'Пінгвін', text: 'Пінгвіни — птахи, що не літають, але вони геніальні плавці та пірнальники.' },
  'anchor': { title: 'Якір', text: 'Якір тримає корабель на місці. Найперші якорі були просто важким камінням.' },
  'wave': { title: 'Хвиля', text: 'Більшість хвиль створює вітер. Вони можуть проходити тисячі кілометрів океаном.' },
  'canoe': { title: 'Каное', text: 'Один із найдавніших видів човнів. Люди плавали на них ще тисячі років тому.' },
  'ice': { title: 'Айсберг', text: '90% айсберга ховається під водою. Це робить їх дуже небезпечними для кораблів.' },
  'surfer': { title: 'Серфінг', text: 'Серфінг зародився на Гаваях. Це мистецтво катання на енергії океанічних хвиль.' },
  'trident': { title: 'Тризуб', text: 'Магічна зброя Посейдона. За легендами, він міг викликати шторм одним ударом.' }
};

const entity = computed(() => marineLibrary[props.entityId] || null);

const getIcon = (id) => {
  const icons = {
    'dolphin': '🐬', 'whale': '🐳', 'octopus': '🐙', 'squid': '🦑', 'crab': '🦀',
    'pufferfish': '🐡', 'fish': '🐠', 'shark': '🦈', 'shell': '🐚', 'ship': '🚢',
    'island': '🏝️', 'mermaid': '🧜‍♀️', 'penguin': '🐧', 'anchor': '⚓', 'wave': '🌊',
    'canoe': '🛶', 'ice': '🧊', 'surfer': '🏄', 'trident': '🔱'
  };
  return icons[id] || '🌊';
};
</script>

<style scoped>
.marine-encyclopedia {
  width: 100%;
  margin: 0 auto;
  background: linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.01));
  border: 1px solid rgba(125, 211, 252, 0.2);
  border-radius: 28px;
  padding: 32px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative;
  overflow: hidden;
}
.marine-encyclopedia::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(125,211,252,0.5), transparent);
}

.enc-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(125,211,252,0.18), transparent 70%);
  pointer-events: none;
}

.encyclopedia-content {
  position: relative;
  z-index: 1;
}

.encyclopedia-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.eco-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #7dd3fc;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.eco-badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
}

.eco-icon-wrap {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.eco-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 14px rgba(56, 189, 248, 0.5));
  z-index: 1;
}
.eco-icon-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px dashed rgba(125, 211, 252, 0.35);
  animation: spin-slow 14s linear infinite;
}
@keyframes spin-slow { to { transform: rotate(360deg); } }

h2 {
  font-family: 'Unbounded', sans-serif;
  background: linear-gradient(135deg, #fff 30%, #7dd3fc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 800;
  letter-spacing: -0.01em;
}

p {
  font-size: 1.02rem;
  line-height: 1.7;
  color: #e2e8f0;
  opacity: 0.88;
}

.placeholder {
  border: 1.5px dashed rgba(125, 211, 252, 0.2);
  text-align: center;
  opacity: 0.7;
  padding: 36px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.ph-icon {
  font-size: 2.2rem;
  opacity: 0.6;
  animation: float-soft 3.5s ease-in-out infinite;
}
@keyframes float-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.placeholder p {
  font-size: 0.95rem;
  opacity: 0.85;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-up-enter-from { opacity: 0; transform: translateY(24px) scale(0.98); }
.slide-up-leave-to { opacity: 0; transform: translateY(-12px) scale(0.98); }
</style>
