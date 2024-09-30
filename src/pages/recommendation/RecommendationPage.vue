<template>
  <h1 class="page-title">추천 상품</h1>
  <!-- 여기에 멤버 정보와 키워드 -->
   <div>
    <MemberComponent/>
   </div>
  <div class="container">
    <!-- 예적금 추천 섹션 -->
    <div class="recommendation-section">
      <h2 class="title">예적금 추천</h2>
      <!-- 토글 버튼 (예금/적금 선택) -->
      <div class="toggle-container">
        <button @click="activeTab = 1" :class="{ 'active': activeTab === 1 }">
          적금
        </button>
        <button @click="activeTab = 0" :class="{ 'active': activeTab === 0 }">
          예금
        </button>
      </div>

      <!-- 예금 및 적금 추천 -->
      <div v-show="activeTab === 1">
        <DepositRecommendation class="recommendation-item" />
      </div>
      <div v-show="activeTab === 0">
        <SavingsRecommendation class="recommendation-item" />
      </div>
    </div>

    <div class="fund-section">
      <h2 class="title">펀드 추천</h2>
      <FundRecommendation class="recommendation-item" />
    </div>
  </div>
</template>

<script>
import DepositRecommendation from '@/components/recommendation/DepositRecommendation.vue';
import FundRecommendation from '@/components/recommendation/FundRecommendation.vue';
import MemberComponent from '@/components/recommendation/MemberComponent.vue';
import SavingsRecommendation from '@/components/recommendation/SavingsRecommendation.vue';

export default {
  components: {
    DepositRecommendation,
    FundRecommendation,
    SavingsRecommendation,
    MemberComponent
  },
  data() {
    return {
      activeTab: 1 // 예금 탭을 기본 선택
    };
  }
};
</script>

<style scoped>
/* 전체 페이지의 타이틀 */
.page-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #0A3459;
  /* 타이틀 색상 변경 */
}

/* 레이아웃 설정 */
.container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  /* 두 섹션 사이의 간격을 좁힘 */
  margin: auto;
  max-width: 1500px;
  padding: 10px;
  box-sizing: border-box;
}

/* 토글 버튼 컨테이너 */
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
  background-color: #F2F2F2;
  /* 기본 배경색 */
  color: #333;
  /* 기본 텍스트 색상 */
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.toggle-container button.active {
  background-color: #0A3459;
  /* 활성화된 버튼 색상 */
  color: #fff;
  /* 활성화된 버튼 텍스트 색상 */
}

.toggle-container button:hover {
  background-color: #3C74A6;
  /* hover 시 배경색 */
  color: #fff;
  /* hover 시 텍스트 색상 */
}

/* 추천 상품 섹션 */
.recommendation-section,
.fund-section {
  width: 100%;
  /* 두 섹션이 동일한 너비를 갖도록 설정 */
}

/* 추천 아이템 간격 */
.recommendation-item {
  margin-bottom: 20px;
}

/* 미디어 쿼리: 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    padding: 15px;
  }

  .recommendation-section,
  .fund-section {
    width: 100%;
  }

  .fund-section {
    position: relative;
    top: 0;
  }
}
</style>
