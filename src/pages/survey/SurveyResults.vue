<template>
  <div class="survey-results">
    <h2>설문 결과</h2>
    <div class="result-summary">
      <p class="investment-style">
        {{ usertwo.nickname }}님의 투자 성향은
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
          <td :style="{ backgroundColor: style.color }">{{ style.type }}</td>
          <td>{{ style.recommendations }}</td>
        </tr>
      </tbody>
    </table>
    <div class="button-container">
      <button
        class="btn btn-primary"
        @click="restartSurvey"
        style="margin-right: 10px"
      >
        다시 시작하기
      </button>
      <a href="/recmd" class="btn btn-primary"> 추천상품 보러가기 </a>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useProfileStore } from '@/stores/profileStore';
import { useSurveyStore } from '../../stores/surveyStore';

export default {
  setup() {
    const router = useRouter();
    const surveyStore = useSurveyStore();
    const userStore = useUserStore();
    const profileStore = useProfileStore();
    userStore.checkLoginStatus(); // 로그인 상태 확인

    onMounted(async () => {
      // 설문 결과를 제출합니다.
      await surveyStore.submitSurvey();
    });

    const investmentStyles = [
      {
        type: '매우 보수적',
        color: '#A8E6CF', // 연한 초록색
        recommendations: '안전한 적금, 국채',
      },
      {
        type: '보수적',
        color: '#B3E5FC', // 연한 파란색
        recommendations: '채권형 펀드, 안정형 상품',
      },
      {
        type: '중립적',
        color: '#FFEB3B', // 밝은 노란색
        recommendations: '혼합형 펀드, ETF',
      },
      {
        type: '적극적',
        color: '#FF9800', // 중간 주황색
        recommendations: '주식형 펀드, 해외 주식',
      },
      {
        type: '매우 적극적',
        color: '#FF5722', // 밝은 빨간색
        recommendations: '암호화폐, 레버리지 투자',
      },
    ];

    const investmentStyle = computed(() => {
      if (userStore.usertwo?.riskPoint <= 15) return '매우 보수적';
      if (userStore.usertwo?.riskPoint <= 21) return '보수적';
      if (userStore.usertwo?.riskPoint <= 27) return '중립적';
      if (userStore.usertwo?.riskPoint <= 33) return '적극적';
      return '매우 적극적';
    });

    const investmentStyleColor = computed(() => {
      if (userStore.usertwo?.riskPoint <= 15) return '#A8E6CF'; // 연한 초록색
      if (userStore.usertwo?.riskPoint <= 21) return '#B3E5FC'; // 연한 파란색
      if (userStore.usertwo?.riskPoint <= 27) return '#FFEB3B'; // 밝은 노란색
      if (userStore.usertwo?.riskPoint <= 33) return '#FF9800'; // 중간 주황색
      return '#FF5722'; // 밝은 빨간색
    });

    const restartSurvey = () => {
      surveyStore.resetSurvey();
      router.push({ name: 'StartSurvey' });
    };

    return {
      restartSurvey,
      investmentStyle,
      investmentStyleColor,
      investmentStyles,
      usertwo: profileStore.usertwo, // usertwo 추가
    };
  },
};
</script>

<style scoped>
.survey-results {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin: 20px 0;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
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
}

.score-table th {
  background-color: #f0f0f0;
}

.highlight {
  border: 2px solid #000; /* 강조를 위한 테두리 */
  font-weight: 1000; /* 더 굵은 폰트 설정 */
  background-color: #dbe2ef;
}

.highlight td {
  font-weight: 1000; /* 하이라이트된 셀의 텍스트를 더 굵게 설정 */
}

.button-container {
  margin-top: 20px; /* 버튼 간 간격 추가 */
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
  border: 2px solid transparent; /* 기본 테두리 설정 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 기본 그림자 */
  text-transform: uppercase; /* 대문자화 */
  font-weight: bold; /* 두껍게 설정 */
}

.btn:hover {
  background-color: #007bff; /* 버튼 호버 시 색상 변경 */
  transform: scale(1.002); /* 호버 시 크기 증가 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* 호버 시 그림자 변화 */
  border: 2px solid #007bff; /* 호버 시 테두리 색상 변경 */
}
</style>
