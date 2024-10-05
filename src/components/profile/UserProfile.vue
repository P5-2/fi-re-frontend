<template>
  <div class="user-profile card mb-4">
    <div class="card-body">
      <h3>“{{ user.nickname }}”</h3>
      <img :src="characterImage" alt="Character" class="character-image" />
      <p>Lv. {{ level }}</p>
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: progressPercentage }"
          aria-valuenow="15"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <p>exp {{ user.exp }} / 6</p>
    </div>
  </div>
</template>

<script>
import level1Image from '@/assets/exp/level1.png';
import level2Image from '@/assets/exp/level2.png';
import level3Image from '@/assets/exp/level3.png';
import defaultImage from '@/assets/exp/level4.png';

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  computed: {
    level() {
      return this.calculateLevel(this.user.exp);
    },
    progressPercentage() {
      return this.calculateProgressPercentage(this.user.exp);
    },
    characterImage() {
      if (!this.user || typeof this.user.exp !== 'number') {
        return defaultImage; // 기본 이미지 반환
      }

      if (this.level === 1) {
        return level1Image;
      } else if (this.level === 2) {
        return level2Image;
      } else if (this.level === 3) {
        return level3Image;
      } else {
        return defaultImage;
      }
    },
  },
  methods: {
    calculateLevel(exp) {
      return Math.floor(exp / 6) + 1; // 레벨 계산
    },
    calculateProgressPercentage(exp) {
      const currentLevelExp = this.calculateExpInCurrentLevel(exp);
      return exp >= 6 ? '100%' : `${(currentLevelExp / 6) * 100}%`;
    },
    calculateExpInCurrentLevel(exp) {
      return exp % 6; // 현재 레벨에서의 경험치
    },
  },
};
</script>

<style scoped>
.character-image {
  width: 50px; /* 캐릭터 이미지 크기 조정 */
  height: auto;
  margin-bottom: 10px; /* 이미지와 텍스트 간의 간격 */
}
</style>
