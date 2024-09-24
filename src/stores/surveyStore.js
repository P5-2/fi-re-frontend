import { defineStore } from 'pinia';
import axios from 'axios';

export const useSurveyStore = defineStore('survey', {
  state: () => ({
    current: 0,
    total: 9, // 전체 페이지 수
    pages: [],
    results: Array(8).fill(0), // 각 페이지 점수 초기화
    specificScores: { 3: 0, 5: 0 }, // 특정 페이지 점수 저장
    totalScore: 0,
    showResults: false,
    selectedOptions: Array(9).fill(null),
  }),
  actions: {
    async initializePages() {
      this.results = Array(this.total).fill(0); // 각 페이지에 맞춰 results 배열 초기화
      this.selectedOptions = Array(this.total).fill(null);
      this.pages = [
        {
          question: '당신의 연령은 어떻게 됩니까?',
          options: [
            { text: '19세 이하', score: 1 },
            { text: '20세 ~ 40세', score: 2 },
            { text: '41세 ~ 50세', score: 3 },
            { text: '51세 ~ 60세', score: 4 },
            { text: '60세 이상', score: 5 },
          ],
        },
        {
          question: '투자하고자 하는 자금의 투자 가능 기간은 얼마나 됩니까?',
          options: [
            { text: '6개월 이내', score: 1 },
            { text: '6개월 ~ 1년 이내', score: 2 },
            { text: '1년 ~ 2년 이내', score: 3 },
            { text: '2년 ~ 3년 이내', score: 4 },
            { text: '3년 이상', score: 5 },
          ],
        },
        {
          question: '다음 중 투자경험과 가장 가까운 것은 어느 것입니까?',
          options: [
            { text: '은행 예금/적금', score: 1 },
            { text: '금융채', score: 2 },
            { text: '신용도 중간 등급의 회사채', score: 3 },
            { text: '신용도가 낮은 회사채', score: 4 },
            { text: 'ELW, 선물옵션', score: 5 },
          ],
        },
        {
          question:
            '금융상품 투자에 대한 본인의 수준은 어느 정도라고 생각하십니까?',
          options: [
            { text: '[매우 낮은 수준]', score: 1 },
            { text: '[낮은 수준]', score: 2 },
            { text: '[높은 수준]', score: 3 },
            { text: '[매우 높은 수준]', score: 4 },
          ],
        },
        {
          question:
            '현재 투자하고자 하는 자금은 전체 금융자산 중 어느 정도의 비중을 차지합니까?',
          options: [
            { text: '10% 이내', score: 1 },
            { text: '10% ~ 20% 이내', score: 2 },
            { text: '20% ~ 30% 이내', score: 3 },
            { text: '30% ~ 40% 이내', score: 4 },
            { text: '40% 초과', score: 5 },
          ],
        },
        {
          question:
            '다음 중 당신의 수입원을 가장 잘 나타내고 있는 것은 어느 것입니까?',
          options: [
            { text: '현재 일정한 수입이 발생하고 있으며', score: 1 },
            { text: '현재 일정한 수입이 발생하고 있으나', score: 2 },
            { text: '현재 일정한 수입원이 없으며', score: 3 },
          ],
        },
        {
          question:
            '만약 투자원금에 손실이 발생할 경우 다음 중 감수할 수 있는 손실 수준은 어느 것입니까?',
          options: [
            { text: '무슨 일이 있어도 투자원금은 보전되어야 한다.', score: 1 },
            {
              text: '10% 미만까지는 손실을 감수 할 수 있을 것 같다.',
              score: 2,
            },
            {
              text: '20% 미만까지는 손실을 감수 할 수 있을 것 같다.',
              score: 3,
            },
            {
              text: '기대수익이 높다면 위험이 높아도 상관하지 않겠다.',
              score: 4,
            },
          ],
        },
        {
          question: '투자에 대한 본인의 성향은 어떤가요?',
          options: [
            { text: '안정적인 성향', score: 1 },
            { text: '균형 잡힌 성향', score: 2 },
            { text: '공격적인 성향', score: 3 },
          ],
        },
        {
          question: '투자 결정을 할 때 가장 중요하게 생각하는 것은 무엇인가요?',
          options: [
            { text: '전문가의 조언', score: 1 },
            { text: '자신의 경험', score: 2 },
            { text: '시장 동향', score: 3 },
          ],
        },
      ];
    },
    selectOption(index) {
      try {
        const selectedScore = this.pages[this.current].options[index].score;
        this.results[this.current] = selectedScore; // 선택된 점수 저장
        this.selectedOptions[this.current] = index;

        // 특정 페이지 점수 업데이트
        if (this.current === 2) {
          this.specificScores[3] = selectedScore; // 3페이지 점수 저장
        } else if (this.current === 4) {
          this.specificScores[5] = selectedScore; // 5페이지 점수 저장
        }

        // 총점 계산
        this.totalScore = this.results.reduce((a, b) => a + b, 0);
      } catch (error) {
        console.error('선택 처리 중 오류 발생:', error);
        console.log('Current state:', {
          current: this.current,
          results: this.results,
          pages: this.pages,
        });
      }
    },
    resetSurvey() {
      this.current = 0; // 현재 페이지 초기화
      this.results = Array(this.total).fill(0); // 결과 초기화
      this.specificScores = { 3: 0, 5: 0 }; // 특정 점수 초기화
      this.totalScore = 0; // 총점 초기화
      this.showResults = false; // 결과 표시 상태 초기화
      this.initializePages(); // 페이지 초기화
    },
    nextPage() {
      if (this.current < this.total - 1) {
        this.current++;
      } else {
        this.showResults = true; // 마지막 페이지에서 결과 표시
      }
    },
    prevPage() {
      if (this.current > 0) {
        this.current--;
      }
    },
    async submitSurvey() {
      try {
        await axios.post('/api/survey/submit', {
          results: this.results,
          specificScores: this.specificScores,
          totalScore: this.totalScore,
        });
        console.log('결과가 성공적으로 제출되었습니다.');
      } catch (error) {
        console.error('결과 제출에 실패했습니다:', error);
      }
    },
  },
});
