<template>
  <div>
    <MemberComponent />
  </div>
  <div class="container">
    <div class="button-section">
      <div class="toggle-container">
        <button
          @click="toggleComponent('deposit')"
          :class="{ active: activeComponents.includes('deposit') }"
        >
          예금
        </button>
        <button
          @click="toggleComponent('savings')"
          :class="{ active: activeComponents.includes('savings') }"
        >
          적금
        </button>
        <button
          @click="toggleComponent('fund')"
          :class="{ active: activeComponents.includes('fund') }"
        >
          펀드
        </button>
      </div>
    </div>

    <div class="recommendation-items">
      <DepositRecommendation
        v-if="activeComponents.includes('deposit')"
        class="recommendation-item"
      />
      <SavingsRecommendation
        v-if="activeComponents.includes('savings')"
        class="recommendation-item"
      />
      <FundRecommendation
        v-if="activeComponents.includes('fund')"
        class="recommendation-item"
      />
    </div>
  </div>
</template>

<script>
import DepositRecommendation from '@/components/recommendation/DepositRecommendation.vue';
import FundRecommendation from '@/components/recommendation/FundRecommendation.vue';
import MemberComponent from '@/components/recommendation/MemberComponent.vue';
import SavingsRecommendation from '@/components/recommendation/SavingsRecommendation.vue';
import axios from 'axios'; // axios 추가

export default {
  components: {
    DepositRecommendation,
    FundRecommendation,
    SavingsRecommendation,
    MemberComponent,
  },
  data() {
    return {
      activeComponents: ['deposit', 'savings', 'fund'],
    };
  },
  mounted() {
    this.trackPageVisit();
  },
  methods: {
    toggleComponent(component) {
      const index = this.activeComponents.indexOf(component);
      if (index > -1) {
        this.activeComponents.splice(index, 1);
      } else {
        this.activeComponents.push(component);
      }
    },
    async trackPageVisit() {
      try {
        const tokenData = JSON.parse(sessionStorage.getItem('token'));
        const accessToken = tokenData?.accessToken;

        await axios.post(
          `http://localhost:9000/exp`,
          {
            page: 'recommaendation', // 현재 페이지 이름
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error('Error tracking page visit:', error);
      }
    },
  },
};
</script>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #0a3459;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: auto;
  max-width: 1500px;
  padding: 10px;
  box-sizing: border-box;
}

.recommendation-items {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.toggle-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.toggle-container button {
  padding: 8px 20px;
  font-size: 14px;
  border: none;
  background-color: #f2f2f2;
  color: #333;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.toggle-container button.active {
  background-color: #0a3459;
  color: #fff;
}

.toggle-container button:hover {
  background-color: #3c74a6;
  color: #fff;
}

.button-section,
.fund-section {
  width: 100%;
}

.recommendation-item {
  flex: 1 1 calc(50% - 20px);
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .recommendation-items {
    flex-direction: column;
  }

  .recommendation-item {
    flex: 1 1 100%;
  }
}
</style>
