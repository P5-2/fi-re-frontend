<template>
  <div class="survey-container">
    <h2 class="question">{{ question }}</h2>
    <div class="options">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="option"
        :class="{ selected: surveyStore.selectedOptions[current] === index }"
        @click="selectOption(index)"
      >
        {{ option.text }}
      </div>
    </div>
    <div class="button-controller">
      <button class="btn btn-secondary" @click="goBack">이전</button>
      <button
        class="btn btn-primary"
        @click="$emit('next')"
        :disabled="selectedOption === null"
      >
        {{ isLastPage ? '결과 보기' : '다음' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useSurveyStore } from '../../stores/surveyStore';
import { useRouter } from 'vue-router';

export default {
  props: {
    question: String,
    options: Array,
    current: {
      type: Number,
      required: true, // 필수 prop로 설정
    },
    total: Number,
    isLastPage: Boolean,
  },
  setup(props, { emit }) {
    const selectedOption = ref(null);
    const surveyStore = useSurveyStore();
    const router = useRouter();

    const selectOption = (index) => {
      surveyStore.selectOption(index);
      console.log('Selected option index:', index);
    };

    const goBack = () => {
      console.log('Current value:', props.current);
      if (props.current === 0) {
        router
          .push({ name: 'StartSurvey' })
          .then(() => {
            console.log('Navigated to StartSurvey');
          })
          .catch((err) => {
            console.error('Navigation error:', err);
          });
      } else {
        emit('prev');
      }
    };

    return {
      surveyStore,
      selectOption,
      goBack,
    };
  },
};
</script>

<style scoped>
.survey-container {
  padding: 20px; /* 블록 안쪽 여백 */
  border: 1px solid #ccc; /* 테두리 추가 */
  border-radius: 8px; /* 모서리 둥글게 */
  background-color: #f9f9f9; /* 배경색 추가 */
  margin: 20px 0; /* 상하 여백 추가 */
}

.question {
  font-size: 24px; /* 질문 글자 크기 조정 */
  font-weight: bold; /* 질문 글자 굵게 */
  margin-bottom: 15px; /* 질문과 옵션 간의 간격 조정 */
  color: #333; /* 질문 글자 색상 */
  text-align: center; /* 질문 중앙 정렬 */
}

.options {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px; /* 버튼과의 간격 조정 */
}

.option {
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px; /* 옵션 글자 크기 조정 */
  border-radius: 5px; /* 모서리 둥글게 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

.option.selected {
  background-color: #3dd2af; /* 선택된 상태 색상 */
  color: white;
  font-weight: bold; /* 선택된 텍스트 굵게 */
}

.button-controller {
  display: flex;
  justify-content: space-between; /* 버튼 사이 간격 조정 */
}
</style>
