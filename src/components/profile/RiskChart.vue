<template>
  <div class="risk-chart card mb-4">
    <div class="card-body">
      <div class="result-summary">
        <p class="investment-style" style="color: black">
          {{ nickname }}님의 투자 성향은
          <span :style="{ color: investmentStyleColor }">
            <strong>{{ investmentStyle }}</strong>
          </span>
          입니다.
        </p>
      </div>
      <table class="score-table">
        <thead>
          <tr>
            <th>투자 성향</th>
            <th>추천 상품</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(style, index) in investmentStyles"
            :key="index"
            :class="{ highlight: investmentStyle === style.type }"
          >
            <td :style="{ backgroundColor: style.color, color: 'black' }">
              {{ style.type }}
            </td>
            <td style="color: black">{{ style.recommendations }}</td>
          </tr>
        </tbody>
      </table>
      <a href="/recmd" class="btn btn-primary"> 추천상품 보러가기 </a>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
export default {
  props: {
    riskPoint: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
    },
  },
  setup() {
    const userStore = useUserStore();
    userStore.checkLoginStatus(); // 로그인 상태 확인
    return {
      userStore,
    };
  },
  computed: {
    investmentStyle() {
      if (this.riskPoint < 15) return '매우 보수적';
      if (this.riskPoint < 21) return '보수적';
      if (this.riskPoint < 27) return '중립적';
      if (this.riskPoint < 33) return '적극적';
      return '매우 적극적';
    },
    investmentStyleColor() {
      if (this.riskPoint < 15) return '#A8E6CF';
      if (this.riskPoint < 21) return '#B3E5FC';
      if (this.riskPoint < 27) return '#FFEB3B';
      if (this.riskPoint < 33) return '#FF9800';
      return '#FF5722';
    },
    investmentStyles() {
      return [
        {
          type: '매우 보수적',
          color: '#A8E6CF',
          recommendations: '안전한 적금, 국채',
        },
        {
          type: '보수적',
          color: '#B3E5FC',
          recommendations: '채권형 펀드, 안정형 상품',
        },
        {
          type: '중립적',
          color: '#FFEB3B',
          recommendations: '혼합형 펀드, ETF',
        },
        {
          type: '적극적',
          color: '#FF9800',
          recommendations: '주식형 펀드, 해외 주식',
        },
        {
          type: '매우 적극적',
          color: '#FF5722',
          recommendations: '암호화폐, 레버리지 투자',
        },
      ];
    },
  },
};
</script>

<style scoped>
.risk-chart {
  padding: 20px;
  border: 1px solid #ffffff;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 60px 0 20px; /* 상단 마진을 추가하여 헤더와의 간격을 확보 */
  text-align: center;
}

.result-summary {
  margin-bottom: 20px;
}

.investment-style {
  font-size: 18px;
  font-weight: bold;
}

.score-table {
  width: 80%;
  border-collapse: collapse;
  margin: 0 auto;
  margin-bottom: 20px;
}

.score-table th,
.score-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  font-size: 16px;
}

.score-table td {
  font-weight: normal;
  color: black; /* 모든 텍스트를 검은색으로 설정 */
}

.score-table th {
  background-color: #f0f0f0;
  color: black; /* 헤더 글씨 색상 검은색 */
}

.highlight {
  border: 2px solid #000; /* 강조를 위한 테두리 */
  font-weight: bold; /* 하이라이트된 부분의 폰트 굵게 설정 */
}

.highlight td {
  font-weight: bold; /* 하이라이트된 셀의 텍스트 굵게 설정 */
}
</style>
