import { defineStore } from 'pinia';
import axios from 'axios';

export const useSurveyStore = defineStore('survey', {
  state: () => ({
    current: 0,
    total: 10, // 전체 페이지 수
    pages: [],
    keywords: [],
    results: Array(10).fill(0),
    specificScores: { 4: 0, 7: 0 },
    // 2: 기간 5: 금액
    totalScore: 0,
    age: '',
    assets: 0,
    salary: 0,
    showResults: false,
    selectedOptions: Array(11).fill(null),
  }),
  actions: {
    async initializePages() {
      this.results = Array(this.total).fill(0); // 각 페이지에 맞춰 results 배열 초기화
      this.selectedOptions = Array(this.total).fill(null);
      this.pages = [
        {
          question: '당신의 연령은 어떻게 됩니까?',
          options: [
            { text: '10대', score: 1 },
            { text: '20대', score: 1 },
            { text: '30대', score: 2 },
            { text: '40대', score: 3 },
            { text: '50대', score: 4 },
            { text: '60대 이상', score: 5 },
          ],
        },
        {
          question: '당신의 자산은 어느 정도입니까?',
          input: true,
          value: 0,
        },
        {
          question: '당신의 급여는 어느 정도입니까?',
          input: true,
          value: 0,
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
        // 현재 질문이 입력 질문인지 확인
        if (this.pages[this.current].input) {
          // 입력 질문일 경우, 입력된 자산 값을 저장
          const inputValue = this.pages[this.current].value; // 입력값 가져오기
          this.assets = inputValue; // 자산에 입력값 저장
          this.selectedOptions[this.current] = null; // 선택된 옵션 없음으로 설정
          return; // 더 이상 진행하지 않음
        }

        // 선택된 옵션 처리
        const selectedScore = this.pages[this.current].options[index].score;
        this.results[this.current] = selectedScore; // 선택된 점수 저장
        this.selectedOptions[this.current] = index;

        // 특정 페이지 점수 업데이트
        if (this.current === 3) {
          this.specificScores[4] = selectedScore; // 3페이지 점수 저장
        } else if (this.current === 6) {
          this.specificScores[7] = selectedScore; // 6페이지 점수 저장
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
      this.current = 0;
      this.results = Array(this.total).fill(0);
      this.specificScores = { 4: 0, 7: 0 };
      this.totalScore = 0;
      this.showResults = false;
      this.assets = 0;
      this.age = ''; // 나이대 초기화
      this.keywords = []; // 키워드 초기화
      this.salary = 0;
      this.initializePages();
    },

    async submitSurvey() {
      try {
        // 나이대 및 키워드 설정
        const ageOption = this.selectedOptions[0]; // 첫 번째 질문의 선택된 옵션으로 나이대 결정

        if (this.assets <= 0) {
          throw new Error('자산 입력값이 유효하지 않습니다.');
        }

        if (ageOption !== null) {
          const selectedAge = this.pages[0].options[ageOption].score;

          // 나이대 문자열 변환
          if (selectedAge === 1) {
            this.age = '10'; // 10대
          } else if (selectedAge === 2) {
            this.age = '20'; // 20대
          } else if (selectedAge === 3) {
            this.age = '30'; // 30대
          } else if (selectedAge === 4) {
            this.age = '40'; // 40대
          } else if (selectedAge === 5) {
            this.age = '60'; // 60대 이상
          }
        }

        // 키워드 설정
        const riskScore = this.specificScores[2]; // 2번 페이지 점수
        const amountScore = this.specificScores[5]; // 5번 페이지 점수

        if (riskScore >= 3) {
          this.keywords.push('장기'); // 3점 이상이면 '장기'
        } else {
          this.keywords.push('단기'); //
        }

        if (amountScore >= 3) {
          this.keywords.push('고액'); //3점 이상이면 '고액' 추가
        } else {
          this.keywords.push('소액'); // 그렇지 않으면 '소액' 추가
        }

        const postData = {
          totalScore: this.totalScore,
          age: this.age,
          assets: this.assets,
          keywords: this.keywords,
          salary: this.salary,
        };

        const tokenData = JSON.parse(sessionStorage.getItem('token'));
        const accessToken = tokenData.accessToken;

        console.log(this.assets);
        await axios.post('http://localhost:9000/survey/result', postData, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 accessToken 포함
          },
        });
        console.log('결과가 성공적으로 제출되었습니다.');
      } catch (error) {
        console.error('결과 제출에 실패했습니다:', error);
      }
    },

    nextPage() {
      if (this.current < this.total - 1) {
        this.current++;
      } else {
        this.showResults = true; // 마지막 페이지에서 결과 표시
        console.log('Specific scores before routing:', this.specificScores);
      }
    },
    prevPage() {
      if (this.current > 0) {
        this.current--;
      }
    },
  },
});
