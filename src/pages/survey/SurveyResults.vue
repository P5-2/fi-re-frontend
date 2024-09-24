<template>
  <div class="survey-results">
    <h2>설문 결과</h2>
    <div class="result-summary">
      <p class="investment-style">
        님의 투자 성향은
        <span :style="{ color: investmentStyleColor }"
          ><strong>{{ investmentStyle }}</strong></span
        >
        입니다.
      </p>
      <p>
        총 점수: <strong>{{ totalScore }}</strong>
      </p>
    </div>
    <table class="score-table">
      <thead>
        <tr>
          <th>점수대</th>
          <th>투자 성향</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(style, index) in investmentStyles" :key="index">
          <td>{{ style.range }}</td>
          <td :style="{ backgroundColor: style.color }">{{ style.type }}</td>
        </tr>
      </tbody>
    </table>
    <button class="btn btn-primary" @click="restartSurvey">
      다시 시작하기
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSurveyStore } from '../../stores/surveyStore';

export default {
  props: {
    totalScore: {
      type: Number,
      required: true,
    },
    results: {
      type: Array,
      required: true,
    },
    specificScores: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const surveyStore = useSurveyStore(); // 스토어 초기화

    const investmentStyles = [
      { range: '0 - 20', type: '매우 보수적', color: '#ffcccc' }, // 연한 빨강
      { range: '21 - 40', type: '보수적', color: '#ffe5b4' }, // 연한 오렌지
      { range: '41 - 60', type: '중립적', color: '#ffffcc' }, // 연한 노랑
      { range: '61 - 80', type: '적극적', color: '#cce5ff' }, // 연한 파랑
      { range: '81 - 100', type: '매우 적극적', color: '#c2f0c2' }, // 연한 초록
    ];

    const investmentStyle = computed(() => {
      if (props.totalScore <= 20) return '매우 보수적';
      if (props.totalScore <= 40) return '보수적';
      if (props.totalScore <= 60) return '중립적';
      if (props.totalScore <= 80) return '적극적';
      return '매우 적극적';
    });

    const investmentStyleColor = computed(() => {
      if (props.totalScore <= 20) return '#ff3333'; // 빨강
      if (props.totalScore <= 40) return '#ff9900'; // 오렌지
      if (props.totalScore <= 60) return '#ffcc00'; // 노랑
      if (props.totalScore <= 80) return '#3399ff'; // 파랑
      return '#33cc33'; // 초록
    });

    const restartSurvey = () => {
      surveyStore.resetSurvey();
      router.push({ name: 'StartSurvey' }); // 시작 페이지로 이동
    };

    return {
      restartSurvey,
      investmentStyle,
      investmentStyleColor,
      investmentStyles,
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
  max-width: 600px; /* 최대 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
}

.result-summary {
  margin-bottom: 20px;
}

.investment-style {
  font-size: 18px; /* 질문 글자 크기 조정 */
  font-weight: bold; /* 굵게 */
}

.score-table {
  width: 40%; /* 테이블 너비를 줄임 */
  border-collapse: collapse;
  margin: 0 auto; /* 중앙 정렬 */
  margin-bottom: 20px;
}

.score-table th,
.score-table td {
  border: 1px solid #ccc;
  padding: 5px; /* 패딩 조정 */
  text-align: center;
  font-size: 16px; /* 글자 크기 조정 */
  font-weight: bold; /* 굵게 */
}

.score-table td {
  font-weight: normal; /* 일반 텍스트로 설정 */
}

.score-table th {
  background-color: #f0f0f0;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
