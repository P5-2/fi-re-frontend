<template>
  <div class="user-profile card mb-4">
    <div class="card-body">
      <div class="profile-layout">
        <div class="character-container">
          <img :src="characterImage" alt="Character" class="character-image" />
        </div>
        <div class="user-info">
          <div class="nickname-container">
            <div class="nickname">
              <h3>{{ user.nickname }}</h3>
              <span v-if="level >= 3" class="badge">
                <i class="fas fa-star"></i> 레벨 {{ level }}
              </span>
            </div>
          </div>
          <div class="progress-container">
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
            <p class="exp-text">
              exp {{ user.exp }} / {{ expNeededForNextLevel }}
            </p>
          </div>
        </div>
      </div>
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
    expNeededForNextLevel() {
      return 6 * this.level; // 다음 레벨까지 필요한 경험치
    },
  },
  methods: {
    calculateLevel(exp) {
      // 최대 레벨 4로 제한
      if (exp >= 24) return 4;
      return Math.floor(exp / 6) + 1; // 레벨 계산
    },
    calculateProgressPercentage(exp) {
      // 레벨 4인 경우 100% 고정
      if (this.level === 4) {
        return '100%';
      }
      const currentLevelExp = this.calculateExpInCurrentLevel(exp);
      return `${(currentLevelExp / 6) * 100}%`;
    },
    calculateExpInCurrentLevel(exp) {
      return exp % 6; // 현재 레벨에서의 경험치
    },
  },
};
</script>

<style scoped>
.profile-layout {
  display: flex; /* 좌우로 나누기 */
}

.character-container {
  flex: 1; /* 왼쪽 영역 1로 설정 */
  display: flex;
  align-items: center;
  justify-content: center; /* 수직, 수평 중앙 정렬 */
}

.character-image {
  width: 100%; /* 이미지 너비 100%로 설정 */
  height: auto;
}

.user-info {
  flex: 1; /* 오른쪽 영역 1로 설정 */
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
}

.nickname-container {
  margin-bottom: 10px; /* 닉네임과 프로그래스 바 간격 */
  text-align: center; /* 중앙 정렬 */
}

.nickname {
  display: flex;
  align-items: center; /* 수직 정렬 */
}

.nickname h3 {
  margin: 0; /* 기본 마진 제거 */
  font-size: 22px; /* 이름 크기 증가 */
}

.badge {
  background-color: #3f72af; /* 배지 색상 */
  color: white;
  border-radius: 5px;
  padding: 3px 6px; /* 배지 패딩 증가 */
  margin-left: 5px; /* 이름과 배지 간의 간격 */
  font-size: 16px; /* 배지 텍스트 크기 */
}

.progress-container {
  width: 100%; /* 프로그래스 바 너비 100%로 설정 */
}

.progress {
  background-color: #f9f7f7; /* 프로그래스 바 배경색 */
  border-radius: 5px;
  overflow: hidden; /* 프로그래스 바 안의 요소를 잘라줌 */
}

.progress-bar {
  background-color: #3f72af; /* 프로그래스 바 색상 */
  height: 20px; /* 프로그래스 바 높이 */
}

.exp-text {
  margin-top: 5px; /* 경험치 텍스트와 프로그래스 바 간격 */
  font-size: 16px; /* 경험치 텍스트 크기 */
  text-align: center; /* 중앙 정렬 */
}
</style>
