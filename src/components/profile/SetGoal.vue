<template>
  <div class="set-goal">
    <h2>모으기 목표 설정</h2>
    <form @submit.prevent="submitGoal">
      <label for="goalName">목표 이름</label>
      <input type="text" v-model="goalName" required />

      <label for="targetAmount">목표 금액</label>
      <input type="number" v-model="targetAmount" required />

      <button type="submit">다음 단계</button>
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
  padding: 20px;
}
</style>