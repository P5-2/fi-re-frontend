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
              <h3>{{ usertwo.nickname }}</h3>
              <span
                v-if="level >= 3"
                class="badge"
                :class="{ 'level-badge': level >= 3 }"
              >
                <i class="fas fa-star" style="color: yellow"></i> 레벨
                {{ level }}
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
              exp {{ displayedExp }} / {{ expNeededForNextLevel }}
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
    usertwo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    level() {
      return this.calculateLevel(this.usertwo.exp);
    },
    progressPercentage() {
      return this.calculateProgressPercentage(this.usertwo.exp);
    },
    characterImage() {
      if (!this.usertwo || typeof this.usertwo.exp !== 'number') {
        return defaultImage; 
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
      return 6 * this.level; 
    },
    displayedExp() {
      return this.level === 4 ? 24 : this.usertwo.exp; 
    },
  },
  methods: {
    calculateLevel(exp) {
      if (exp >= 24) return 4;
      return Math.floor(exp / 6) + 1; 
    },
    calculateProgressPercentage(exp) {
      if (this.level === 4) {
        return '100%';
      }
      const currentLevelExp = this.calculateExpInCurrentLevel(exp);
      return `${(currentLevelExp / 6) * 100}%`;
    },
    calculateExpInCurrentLevel(exp) {
      return exp % 6;
    },
  },
};
</script>

<style scoped>
.profile-layout {
  display: flex;
  gap: 20px; 
}

.character-container {
  flex: 1; 
  display: flex;
  align-items: center;
  justify-content: center;
}

.character-image {
  width: 100%;
  height: auto;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column; 
  justify-content: center;
  align-items: center;
}

.nickname-container {
  margin-bottom: 10px;
  text-align: center;
}

.nickname {
  display: flex;
  align-items: center;
}

.nickname h3 {
  margin: 0;
  font-size: 22px;
}

.badge {
  padding: 3px 6px; 
  margin-left: 5px;
  font-size: 16px;
}

.level-badge {
  background-color: #3f72af;
  color: white; 
  border-radius: 5px;
}

.progress-container {
  width: 100%;
}

.progress {
  background-color: #f9f7f7; 
  border-radius: 5px;
  overflow: hidden; 
}

.progress-bar {
  background-color: #3f72af; 
  height: 20px;
}

.exp-text {
  margin-top: 5px; 
  font-size: 16px;
  text-align: center; 
}
</style>
