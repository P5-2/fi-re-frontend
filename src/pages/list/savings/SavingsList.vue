<template>
  <div class="savings-list">
    <div class="savings-container">
      <div
        v-for="savings in paginatedSavings"
        :key="savings.prdNo"
        class="savings-item"
      >
        <Savings
          :description="savings.description"
          :prdNo="savings.prdNo"
          :pname="savings.pname"
          :bname="savings.bname"
          :minRate="savings.minRate"
          :maxRate="savings.maxRate"
          :subPeriod="savings.subPeriod"
        />
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
import Savings from "@/components/list/savings/Savings.vue";

export default {
  name: "SavingsList",
  components: { Savings },
  setup() {
    const allSavings = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = 5;

    const fetchSavings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/finance/savings/all"
        );
        allSavings.value = response.data;
      } catch (error) {
        console.error("Error: savings products", error);
      }
    };

    const paginatedSavings = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return allSavings.value.slice(start, end);
    });

    const totalPages = computed(() =>
      Math.ceil(allSavings.value.length / itemsPerPage)
    );

    const changePage = (direction) => {
      const newPage = currentPage.value + direction;
      if (newPage >= 1 && newPage <= totalPages.value) {
        currentPage.value = newPage;
      }
    };

    onMounted(() => {
      fetchSavings();
    });

    return {
      paginatedSavings,
      currentPage,
      totalPages,
      changePage,
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
