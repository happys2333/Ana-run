<template>
  <div
      class="game-wrapper"
      tabindex="0"
      @keydown="onKeyDown"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      ref="wrapper"
  >
    <div class="hud">
      <div class="score">距离: {{ uiState.score }}m</div>
      <div class="meter-box">
        <label>铁拳追击:</label>
        <div class="progress-bg">
          <div
              class="progress-fill"
              :style="{ width: uiState.doomMeter + '%', background: uiState.doomMeter > 80 ? 'red' : 'orange' }"
          ></div>
        </div>
      </div>
    </div>

    <canvas ref="canvasRef" width="800" height="400"></canvas>

    <div v-if="uiState.state !== 'playing'" class="modal">
      <h2 v-if="uiState.state === 'start'">安娜躲避训练</h2>
      <h2 v-else style="color:red">任务失败</h2>

      <p v-if="uiState.state === 'gameover'">死因: {{ uiState.deathReason }}</p>

      <button @click="startGame">
        {{ uiState.state === 'start' ? '开始任务' : '重试' }}
      </button>

      <div class="tips">
        <p>[空格] 跳跃躲避 <b>探奇(蓝)</b></p>
        <p>[左键] 后撤躲避 <b>铁拳(红)</b></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import GameEngine from './game/core/Engine.js';
import { GAME_STATE } from './game/Constant.js';

const canvasRef = ref(null);
const wrapper = ref(null);
let engine = null;

// 响应式 UI 状态（由 Engine 驱动更新）
const uiState = reactive({
  score: 0,
  doomMeter: 0,
  state: GAME_STATE.START,
  deathReason: ''
});

// 回调函数：让非 Vue 的 JS 文件更新 Vue 的数据
const updateUI = (data) => {
  if (data.score !== undefined) uiState.score = data.score;
  if (data.doomMeter !== undefined) uiState.doomMeter = data.doomMeter;
  if (data.state !== undefined) uiState.state = data.state;
  if (data.deathReason !== undefined) uiState.deathReason = data.deathReason;
};

const startGame = () => {
  if (engine) {
    engine.init();
    wrapper.value.focus(); // 确保键盘事件被捕获
  }
};

// --- 输入处理 ---

const onKeyDown = (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    engine.handleInput('jump');
  } else if (e.code === 'ArrowLeft') {
    engine.handleInput('dash');
  }
};

// 简单的触摸手势
let startX = 0, startY = 0;
const onTouchStart = (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
};
const onTouchEnd = (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx < -30) engine.handleInput('dash'); // 左滑
  } else {
    if (dy < -30) engine.handleInput('jump'); // 上滑
  }
};

onMounted(() => {
  engine = new GameEngine(canvasRef.value, updateUI);
});
</script>

<style scoped>
.game-wrapper {
  position: relative;
  width: 800px;
  height: 400px;
  margin: 0 auto;
  outline: none;
  background: #222;
  border: 2px solid #444;
}
canvas { width: 100%; height: 100%; display: block; }
.hud {
  position: absolute;
  top: 10px; left: 10px; right: 10px;
  display: flex;
  justify-content: space-between;
  color: white;
  pointer-events: none;
}
.meter-box { width: 200px; text-align: right; }
.progress-bg { height: 10px; background: #555; margin-top: 5px; }
.progress-fill { height: 100%; transition: width 0.1s; }
.modal {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}
button {
  margin: 20px; padding: 10px 30px;
  font-size: 20px; cursor: pointer;
  background: #6395ec; border: none; color: white;
}
</style>