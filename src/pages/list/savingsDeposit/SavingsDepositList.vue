<template>
  <div class="savings-list">
    <div class="filter-buttons">
      <button
        @click="setFilter('all')"
        :class="{ active: currentFilter === 'all' }"
      >
        전체
      </button>
      <button
        @click="setFilter('deposit')"
        :class="{ active: currentFilter === 'deposit' }"
      >
        예금
      </button>
      <button
        @click="setFilter('savings')"
        :class="{ active: currentFilter === 'savings' }"
      >
        적금
      </button>
    </div>
    <div class="savings-container">
      <div
        v-for="product in filteredProducts"
        :key="product.finPrdtCd"
        class="savings-item"
      >
        <!-- <Savings v-bind="product" /> -->
        <SavingsDeposit v-bind="product" />
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
import axios from "axios";
import SavingsDeposit from "@/components/list/savingsDeposit/SavingsDeposit.vue";

export default {
  name: "SavingsDepositList",
  components: { SavingsDeposit },
  setup() {
    const allProducts = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(0);
    const totalItems = ref(0);
    const itemsPerPage = 5;
    const currentFilter = ref("all");

    const fetchProducts = async (page = 1) => {
      try {
        const response = await axios.get(
          `http://localhost:9000/finance/pageAll?page=${page}&size=${itemsPerPage}` //url 수정에 따른 수정
        );
        console.log("API response:", response.data);
        allProducts.value = response.data.products;
        totalItems.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        currentPage.value = response.data.currentPage;
      } catch (error) {
        console.error("Error: fetching products", error);
      }
    };

    const filteredProducts = computed(() => {
      if (currentFilter.value === "all") return allProducts.value;
      return allProducts.value.filter(
        (product) => product.productType === currentFilter.value
      );
    });

    const setFilter = (filter) => {
      currentFilter.value = filter;
      currentPage.value = 1;
      fetchProducts();
    };

    const changePage = async (direction) => {
      const newPage = currentPage.value + direction;
      if (newPage >= 1 && newPage <= totalPages.value) {
        await fetchProducts(newPage);
      }
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      filteredProducts,
      currentPage,
      totalPages,
      changePage,
      currentFilter,
      setFilter,
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
