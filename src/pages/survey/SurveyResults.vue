<template>
  <div class="survey-results">
    <h2>설문 결과</h2>
    <div class="result-summary">
      <p class="investment-style">
        {{ userStore.userName }}님의 투자 성향은
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
    <button class="btn btn-primary" @click="restartSurvey">
      다시 시작하기
    </button>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useSurveyStore } from '../../stores/surveyStore';

export default {
  props: {
    totalScore: {
      type: String,
      required: true,
    },
    results: {
      type: Array,
      required: true,
    },
    specificScores: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const surveyStore = useSurveyStore();
    const userStore = useUserStore();
    userStore.checkLoginStatus(); // 로그인 상태 확인
    onMounted(async () => {
      // 설문 결과를 제출합니다.
      await surveyStore.submitSurvey();
    });

    const investmentStyles = [
      {
        type: '매우 보수적',
        color: '#b3e6b3',
        recommendations: '안전한 적금, 국채',
      },
      {
        type: '보수적',
        color: '#66b3ff',
        recommendations: '채권형 펀드, 안정형 상품',
      },
      { type: '중립적', color: '#ffd700', recommendations: '혼합형 펀드, ETF' },
      {
        type: '적극적',
        color: '#ffcc33',
        recommendations: '주식형 펀드, 해외 주식',
      },
      {
        type: '매우 적극적',
        color: '#ff6666',
        recommendations: '암호화폐, 레버리지 투자',
      },
    ];

    const investmentStyle = computed(() => {
      if (props.totalScore <= 15) return '매우 보수적';
      if (props.totalScore <= 21) return '보수적';
      if (props.totalScore <= 27) return '중립적';
      if (props.totalScore <= 33) return '적극적';
      return '매우 적극적';
    });

    const investmentStyleColor = computed(() => {
      if (props.totalScore <= 15) return '#66cc66';
      if (props.totalScore <= 21) return '#66b3ff';
      if (props.totalScore <= 27) return '#ffd700';
      if (props.totalScore <= 33) return '#ffcc33';
      return '#ff6666';
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
      userStore,
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
  font-weight: bold; /* 하이라이트된 부분의 폰트 굵게 설정 */
}

.highlight td {
  font-weight: bold; /* 하이라이트된 셀의 텍스트 굵게 설정 */
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
