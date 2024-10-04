<template>
  <div class="savings-list">
    <FilterButtons :currentFilter="currentFilter" @filter="setFilter" />
    <div class="savings-container">
      <div
        v-for="product in filteredProducts"
        :key="product.savingsDeposit.finPrdtCd"
        class="savings-item"
      >
        <SavingsDeposit v-bind="product.savingsDeposit" />
      </div>
    </div>
    <div class="pagination">
      <button
        @click="changePage(-1)"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        이전
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        @click="changePage(1)"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useSavingsDepositStore } from "@/stores/savingsDepositStore.js";
import SavingsDeposit from "@/components/list/savingsDeposit/SavingsDeposit.vue";
import FilterButtons from "@/components/list/savingsDeposit/FilterButtons.vue";

export default {
  name: "SavingsDepositList",
  components: { SavingsDeposit, FilterButtons },
  setup() {
    // Pinia 스토어 사용
    const store = useSavingsDepositStore();
    const currentFilter = ref("all");

    const filteredProducts = computed(() => {
      return (store.products || []).filter(
        (product) =>
          currentFilter.value === "all" ||
          product.savingsDeposit.prdtDiv.toLowerCase() ===
            currentFilter.value.charAt(0)
      );
    });

    const setFilter = (filter) => {
      currentFilter.value = filter;
      store.fetchProducts(store.currentPage, filter);
    };

    const changePage = async (direction) => {
      const newPage = store.currentPage + direction;
      if (newPage >= 1 && newPage <= store.totalPages) {
        await store.fetchProducts(newPage, currentFilter.value);
      }
    };

    onMounted(() => {
      store.fetchProducts();
    });

    return {
      filteredProducts,
      currentFilter,
      setFilter,
      changePage,
      currentPage: store.currentPage,
      totalPages: store.totalPages,
    };
  },
};
</script>

<style scoped>
.savings-list {
  width: 1176px;
  margin: 0 auto;
  padding: 20px 0;
}

.savings-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.savings-item {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.savings-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.pagination {
  margin: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.pagination-btn {
  background-color: #0080ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #0066cc;
}

.pagination-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
