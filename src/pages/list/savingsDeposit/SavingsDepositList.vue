<template>
  <div class="savings-container">
    <FilterButtons :currentFilter="prdtDiv" @filter="setFilter" />

    <div v-if="products && products.length">
      <SavingsDeposit
        v-for="product in products"
        :key="product.savingsDeposit.fin_prdt_cd"
        :savingsDeposit="product.savingsDeposit"
        :options="product.options"
      />
    </div>

    <div v-else>
      <p>상품 데이터를 가져오는 중입니다...</p>
    </div>

    <div class="pagination">
      <button @click="previousPage" :disabled="pageNumber === 1">이전</button>
      <span>{{ pageNumber }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="pageNumber === totalPages">
        다음
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import SavingsDeposit from "@/components/list/savingsDeposit/SavingsDeposit.vue";
import FilterButtons from "@/components/list/savingsDeposit/FilterButtons.vue";

export default {
  components: {
    SavingsDeposit,
    FilterButtons,
  },
  setup() {
    const products = ref([]);
    const pageNumber = ref(1);
    const totalPages = ref(0);
    const selectedSavingsDeposit = ref([]);
    const isComparisonModalVisible = ref(false);
    const prdtDiv = ref(null);

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/finance/pageAll",
          {
            params: {
              pageNumber: pageNumber.value - 1,
              prdtDiv: prdtDiv.value,
            },
          }
        );
        console.log("Fetched Products:", response.data.list); // 데이터 구조 확인
        products.value = response.data.list || [];
        totalPages.value = response.data.totalPages || 0;
      } catch (error) {
        console.error("상품 데이터를 가져오는 중 오류가 발생했습니다:", error);
      }
    };

    const setFilter = (filter) => {
      if (prdtDiv.value === filter) {
        // 같은 필터를 다시 클릭한 경우
        prdtDiv.value = null; // 필터를 해제
      } else {
        // 다른 필터를 클릭한 경우
        prdtDiv.value = filter;
      }
      fetchProducts();
    };
    const previousPage = () => {
      if (pageNumber.value > 1) {
        pageNumber.value--;
        fetchProducts();
      }
    };

    const nextPage = () => {
      if (pageNumber.value < totalPages.value) {
        pageNumber.value++;
        fetchProducts();
      }
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      pageNumber,
      totalPages,
      selectedSavingsDeposit,
      previousPage,
      nextPage,
      prdtDiv,
      setFilter,
    };
  },
};
</script>

<style scoped>
.savings-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* .compare-button {
  background-color: #3f72af;
  color: #f9f7f7;
} */

.pagination {
  display: block;
  text-align: center;
}

.pagination button {
  margin: 0 5px;
}

.pagination span {
  margin: 0 10px;
}
</style>

<style scoped>
.savings-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.pagination {
  display: block;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 100px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #3f72af;
  color: #f9f7f7;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:hover {
  background-color: #2c5985;
}

.pagination button:disabled {
  background-color: #dbe2ef;
  color: #112d4e;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-weight: bold;
}
</style>
