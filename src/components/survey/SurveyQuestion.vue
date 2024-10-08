<template>
  <div class="survey-container">
    <h2 class="question">{{ question }}</h2>
    <div class="options">
      <div v-if="isInputAsset" class="asset-input-container">
        <input
          type="number"
          v-model="assetValue"
          placeholder="자산 입력 (예: 1000)"
          @input="updateAssetValue"
          class="asset-input"
        />
        <span class="currency-label">만원</span>
      </div>
      <div v-if="isInputSalary" class="salary-input-container">
        <input
          type="number"
          v-model="salaryValue"
          placeholder="급여 입력 (예: 3000)"
          @input="updateSalaryValue"
          class="salary-input"
        />
        <span class="currency-label">만원</span>
      </div>
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
import { computed, ref } from 'vue';
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
    const assetValue = ref(null);
    const salaryValue = ref(null);

    // 키워드로 체크
    const isInputAsset = computed(() => {
      return props.question.includes('자산은');
    });

    const isInputSalary = computed(() => {
      return props.question.includes('급여는');
    });

    const updateAssetValue = () => {
      surveyStore.assets = assetValue.value;
    };

    const updateSalaryValue = () => {
      surveyStore.salary = salaryValue.value;
    };

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
      assetValue,
      salaryValue,
      isInputAsset,
      isInputSalary,
      selectOption,
      goBack,
      isNextDisabled,
      handleNext,
      updateAssetValue,
      updateSalaryValue,
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

.asset-input::placeholder,
.salary-input::placeholder {
  color: #999; /* placeholder 색상 */
  opacity: 1; /* opacity 조정 */
}
.option.selected {
  background-color: #3f72af;
  color: white;
  font-weight: bold;
}

.asset-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px 0;
  width: 20%;
}

.button-controller {
  display: flex;
  justify-content: space-between;
}
.asset-input-container,
.salary-input-container {
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center;
}

.asset-input,
.salary-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px 0;
  width: 30%; /* 입력 필드 크기 조정 */
}

.currency-label {
  margin-left: 5px; /* 입력 필드와 텍스트 사이 여백 */
  font-size: 16px; /* 동일한 폰트 사이즈로 설정 */
  line-height: 1.5; /* 수직 정렬을 맞추기 위해 */
}
</style>
