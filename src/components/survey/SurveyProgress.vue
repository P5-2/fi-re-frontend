<template>
  <div class="mm-survey-progress">
    <div class="mm-progress" :style="{ width: progressWidth }"></div>
  </div>
</template>

<script>
export default {
  props: {
    // 현재 페이지 인덱스
    current: Number,
    // 전체 페이지 수
    total: Number,
  },
  computed: {
    progressWidth() {
      const width = ((this.current + 1) / this.total) * 100;
      console.log(`Current Progress Width: ${width}%`); // 확인용 로그
      return `${width}%`;
    },
  },
};
</script>

<style>
.mm-survey-progress {
  width: 100%; /* 전체 너비 설정 */
  height: 20px; /* 높이 설정 */
  background-color: #e0e0e0; /* 배경색 설정 */
  border-radius: 5px; /* 모서리 둥글게 설정 */
  overflow: hidden;
}

.mm-progress {
  height: 100%; /* 부모의 높이에 맞춰 설정 */
  background-color: #112d4e; /* 진행 바 색상 */
  transition: width 0.3s; /* 애니메이션 효과 */
}
</style>
