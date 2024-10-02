// stores/GoalStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useGoalStore = defineStore('goal', () => {
  const goals = ref([]);
  const currentGoal = ref(null);
  const isGoalSet = ref(false);
  const isProductSelected = ref(false);
  const selectedProduct = ref(null);

  const totalGoalAmount = computed(() => {
    return goals.value.reduce((total, goal) => total + (goal.targetAmount || 0), 0);
  });

  const totalSavedAmount = computed(() => {
    return goals.value.reduce((total, goal) => total + (goal.savedAmount || 0), 0);
  });

  const setGoal = (goal) => {
    currentGoal.value = goal;
    goals.value.push(goal);
    isGoalSet.value = true;
  };

  const setSelectedProduct = (product) => {
    selectedProduct.value = product;
  };

  const addGoal = (goal) => {
    goals.value.push(goal);
  };

  const toggleSetGoal = () => {
    isGoalSet.value = !isGoalSet.value;
  };

  const getAccessToken = () => {
    const tokenData = JSON.parse(sessionStorage.getItem("token"));
    return tokenData?.accessToken;
  };

  const updateTotals = (newGoals) => {
    goals.value = newGoals;
  };

  return {
    goals,
    currentGoal,
    isGoalSet,
    isProductSelected,
    selectedProduct,
    totalGoalAmount,
    totalSavedAmount,
    setGoal,
    setSelectedProduct,
    addGoal,
    toggleSetGoal,
    getAccessToken,
    updateTotals
  };
});