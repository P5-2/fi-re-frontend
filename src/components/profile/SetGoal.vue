<template>
  <div class="set-goal">
    <h2 class="title">모으기 목표 설정</h2>
    <form @submit.prevent="submitGoal" class="goal-form">
      <label for="goalName">목표 이름</label>
      <input
        type="text"
        v-model="goalName"
        required
        class="input-field"
        placeholder="목표 이름을 입력하세요"
      />

      <label for="targetAmount">목표 금액</label>
      <input
        type="number"
        v-model="targetAmount"
        required
        class="input-field"
        placeholder="목표 금액을 입력하세요"
      />

      <button type="submit" class="submit-button">다음 단계</button>
    </form>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useGoalStore } from '@/stores/GoalStore';

export default {
  props: {
    initialGoalName: {
      type: String,
      default: ''
    },
    initialTargetAmount: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const goalStore = useGoalStore();
    const goalName = ref(props.initialGoalName);
    const targetAmount = ref(props.initialTargetAmount);

    const submitGoal = () => {
      goalStore.setGoal({
        goalName: goalName.value,
        targetAmount: targetAmount.value
      });

      emit('goal-set', { goalName: goalName.value, targetAmount: targetAmount.value }); // 부모에게 목표 설정 알림

      // 입력 필드 초기화
      goalName.value = '';
      targetAmount.value = 0;
    };

    watch(() => props.initialGoalName, (newVal) => {
      goalName.value = newVal;
    });

    watch(() => props.initialTargetAmount, (newVal) => {
      targetAmount.value = newVal;
    });

    return {
      goalName,
      targetAmount,
      submitGoal
    };
  }
};
</script>

<style scoped>
.set-goal {
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
}

.title {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
}

.goal-form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.input-field {
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.submit-button {
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
