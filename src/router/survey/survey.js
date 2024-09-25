import StartSurvey from '@/pages/survey/StartSurvey.vue';
import SurveyPage from '@/pages/survey/SurveyPage.vue';
import SurveyResults from '@/pages/survey/SurveyResults.vue';

export default [
  {
    path: '/survey/start',
    name: 'StartSurvey',
    component: StartSurvey,
  },
  {
    path: '/survey',
    name: 'Survey',
    component: SurveyPage,
  },
  {
    path: '/survey/results',
    name: 'SurveyResults',
    component: SurveyResults,
    props: (route) => ({
      totalScore: route.params.totalScore,
      results: route.params.results,
      specificScores: route.params.specificScores,
    }),
  },
];
