<template>
  <div v-if="pages && pages.length > 0" class="mm-survey-container">
    <SurveyProgress :current="current" :total="total" />
    <SurveyQuestion
      v-if="pages.length > 0"
      :question="pages[current].question"
      :options="pages[current].options"
      :current="current"
      @select="handleSelect"
      @next="nextPage"
      @prev="prevPage"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useSurveyStore } from '../../stores/surveyStore';
import SurveyProgress from '../../components/survey/SurveyProgress.vue';
import SurveyQuestion from '../../components/survey/SurveyQuestion.vue';

export default {
  components: {
    SurveyProgress,
    SurveyQuestion,
  },

  setup() {
    const router = useRouter();
    const surveyStore = useSurveyStore();

    // 반응형 속성 선언
    const current = computed(() => surveyStore.current);
    const total = ref(surveyStore.total);
    const pages = computed(() => surveyStore.pages);
    const results = computed(() => surveyStore.results);
    const specificScores = computed(() => surveyStore.specificScores);
    const totalScore = computed(() => surveyStore.totalScore);
    const showResults = ref(surveyStore.showResults);

    const handleSelect = (index) => {
      // 인자 저장

      surveyStore.selectOption(index);
      // 선택 후 다음 페이지로 이동
    };

    const nextPage = async () => {
      await surveyStore.nextPage(); // Store의 nextPage 메서드 호출
      console.log('Current page after next:', surveyStore.current); // 현재 페이지 로그

      if (surveyStore.showResults) {
        // 총점 계산
        surveyStore.totalScore = results.value.reduce((a, b) => a + b, 0);
        console.log('Total score calculated:', surveyStore.totalScore); // 총점 로그

        // 결과 페이지로 라우터 이동하며 점수 전달
        router.push({
          name: 'SurveyResults',
          params: {
            totalScore: surveyStore.totalScore,
            results: surveyStore.results,
            specificScores: surveyStore.specificScores,
          },
        });
      }
    };

    const prevPage = async () => {
      await surveyStore.prevPage();
    };

    // 페이지 초기화
    const initializeSurvey = async () => {
      try {
        await surveyStore.initializePages();
        console.log('Pages initialized:', surveyStore.pages); // 초기화된 페이지 로그
      } catch (error) {
        console.error('Error initializing pages:', error);
      }
    };

    initializeSurvey();

    return {
      current,
      total,
      pages,
      results,
      specificScores,
      totalScore,
      showResults,
      nextPage,
      prevPage,
      handleSelect,
      // resetSurvey,
    };
  },
};
</script>

<style scoped>
.mm-survey-container {
  max-width: 800px; /* 원하는 최대 너비 설정 (예: 800px) */
  margin: 0 auto; /* 중앙 정렬 */
  padding: 20px; /* 여백 추가 (선택 사항) */
}
</style>
