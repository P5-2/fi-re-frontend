<template>
  <h1>추천 상품 페이지</h1>
  <div class="container">
    <div class="recommendation-container">
      <!-- 예적금 추천 컴포넌트 -->
      <DepositRecommendation class="recommendation-item" />

      <!-- 펀드 추천 컴포넌트 -->
      <FundRecommendation class="recommendation-item" />
    </div>
  </div>

</template>

<script>
// DepositRecommendation과 FundRecommendation 컴포넌트를 import
import DepositRecommendation from '@/components/recommendation/DepositRecommendation.vue';
import FundRecommendation from '@/components/recommendation/FundRecommendation.vue';

export default {
  components: {
    DepositRecommendation,  // 예적금 컴포넌트 등록
    FundRecommendation      // 펀드 컴포넌트 등록
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  width: 100%; /* 부모 요소의 너비를 100%로 설정 */
}

.recommendation-container {
  display: flex;
  justify-content: space-between;
  /* 가로 정렬 */
  gap: 1em;
  /* 컴포넌트 간의 간격 */
  width: 1200px;
}

.recommendation-item {
  flex: 1;
  /* 각 컴포넌트가 동일한 너비를 가지도록 설정 */
  min-width: 500px;
  /* 최소 너비 설정 (필요에 따라 조정 가능) */
  max-width: 600px;
  /* 최대 너비 설정 (필요에 따라 조정 가능) */
}

h1 {
  color: #333;
  margin-bottom: 2em;
}
</style>
