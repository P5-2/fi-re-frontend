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
        @click="handleNext"
        :disabled="isNextDisabled"
      >
        {{ isLastPage ? '결과 보기' : '다음' }}
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useSurveyStore } from '../../stores/surveyStore';
import { useRouter } from 'vue-router';

export default {
  props: {
    question: String,
    options: Array,
    current: {
      type: Number,
      required: true,
    },
    total: Number,
    isLastPage: Boolean,
  },
  setup(props, { emit }) {
    const surveyStore = useSurveyStore();
    const router = useRouter();

    const selectOption = (index) => {
      surveyStore.selectOption(index);
      console.log('Selected option index:', index);
    };

    const goBack = () => {
      if (props.current === 0) {
        router.push({ name: 'StartSurvey' }).catch((err) => {
          console.error('Navigation error:', err);
        });
      } else {
        emit('prev');
      }
    };

    const isNextDisabled = computed(() => {
      // 마지막 페이지일 경우 선택된 옵션 여부에 관계없이 버튼 활성화
      return (
        !props.isLastPage &&
        surveyStore.selectedOptions[props.current] === undefined
      );
    });

    const handleNext = () => {
      if (props.isLastPage) {
        // 결과 보기 로직 추가
        emit('showResults');
      } else {
        emit('next');
      }
    };

    return {
      surveyStore,
      selectOption,
      goBack,
      isNextDisabled,
      handleNext,
    };
  },
};
</script>

<style scoped>
.survey-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin: 20px 0;
}

.question {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.options {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.option {
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.option.selected {
  background-color: #3dd2af;
  color: white;
  font-weight: bold;
}

.button-controller {
  display: flex;
  justify-content: space-between;
}
</style>
