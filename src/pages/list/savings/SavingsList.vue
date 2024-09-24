<template>
  <div class="savings-list">
    <h1>예적금 상품 목록</h1>
    <div v-for="savings in paginatedSavings" :key="savings.prdNo">
      <Savings
        :prdNo="savings.prdNo"
        :pname="savings.pname"
        :bname="savings.bname"
        :minRate="savings.minRate"
        :maxRate="savings.maxRate"
        :subPeriod="savings.subPeriod"
        :description="savings.description"
      />
    </div>
    <div class="pagination">
      <button @click="changePage(-1)" :disabled="currentPage === 1">
        이전
      </button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="changePage(1)" :disabled="currentPage === totalPages">
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
