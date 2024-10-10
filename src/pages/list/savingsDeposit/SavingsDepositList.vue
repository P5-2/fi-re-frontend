<template>
  <div class="savings-container">
    <FilterButtons :currentFilter="prdtDiv" @filter="setFilter" />

    <!-- 비교하기 버튼 -->
    <button v-if="prdtDiv === 'DE'" class="compare-button" @click="showComparisonModal"
      :disabled="isComparisonDisabled">
      예금 비교하기 ({{ selectedDepositList.length }}/3)
    </button>
    <button v-if="prdtDiv === 'SA'" class="compare-button" @click="showComparisonModal"
      :disabled="isComparisonDisabled">
      적금 비교하기 ({{ selectedSavingsList.length }}/3)
    </button>

    <div v-if="products && products.length">
      <SavingsDeposit v-for="product in products"
        :key="`${product.savingsDeposit.fin_prdt_cd}_${product.options[0].intr_rate_type_nm}`"
        :savingsDeposit="product.savingsDeposit" :options="product.options" :isSelected="isItemSelected(product)"
        @updateSelected="handleUpdateSelected" />



    </div>

    <div v-else>
      <p>상품 데이터를 가져오는 중입니다...</p>
    </div>

    <div class="pagination">
      <button @click="previousPage" :disabled="pageNumber === 1">이전</button>
      <span>{{ pageNumber }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="pageNumber === totalPages">다음</button>
    </div>

    <!-- 모달 컴포넌트 -->
    <ComparisonModalSavings v-if="prdtDiv === 'SA'" :isComparisonModalVisible="isComparisonModalVisible"
      :selectedSavings="selectedSavingsList" @close="closeModalAndResetSavingsDeposit" />
    <ComparisonModalDeposit v-if="prdtDiv === 'DE' && isComparisonModalVisible"
      :isComparisonModalVisible="isComparisonModalVisible" :selectedDeposits="selectedDepositList"
      @close="closeModalAndResetSavingsDeposit" />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import SavingsDeposit from "@/components/list/savingsDeposit/SavingsDeposit.vue";
import FilterButtons from "@/components/list/savingsDeposit/FilterButtons.vue";
import ComparisonModalDeposit from "@/components/comparison/ComparisionModalDeposit.vue";
import ComparisonModalSavings from "@/components/comparison/ComparisonModalSavings.vue";

export default {
  components: {
    SavingsDeposit,
    FilterButtons,
    ComparisonModalDeposit,
    ComparisonModalSavings,
  },
  setup() {
    const products = ref([]);
    const pageNumber = ref(1);
    const totalPages = ref(0);
    const selectedDepositList = ref([]); // 예금 선택 목록
    const selectedSavingsList = ref([]); // 적금 선택 목록
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

    const handleUpdateSelected = (payload) => {
      const { savingsDeposit, options, isSelected } = payload;
      const uniqueKey = `${savingsDeposit.fin_prdt_cd}_${options[0].intr_rate_type_nm}`;

      if (prdtDiv.value === "DE") {
        if (isSelected) {
          const exists = selectedDepositList.value.some(
            (item) =>
              `${item.savingsDeposit.fin_prdt_cd}_${item.options[0].intr_rate_type_nm}` === uniqueKey
          );
          if (!exists) {
            selectedDepositList.value.push({ savingsDeposit, options });
          }
        } else {
          selectedDepositList.value = selectedDepositList.value.filter(
            (item) =>
              `${item.savingsDeposit.fin_prdt_cd}_${item.options[0].intr_rate_type_nm}` !== uniqueKey
          );
        }
      } else if (prdtDiv.value === "SA") {
        if (isSelected) {
          const exists = selectedSavingsList.value.some(
            (item) =>
              `${item.savingsDeposit.fin_prdt_cd}_${item.options[0].intr_rate_type_nm}` === uniqueKey
          );
          if (!exists) {
            selectedSavingsList.value.push({ savingsDeposit, options });
          }
        } else {
          selectedSavingsList.value = selectedSavingsList.value.filter(
            (item) =>
              `${item.savingsDeposit.fin_prdt_cd}_${item.options[0].intr_rate_type_nm}` !== uniqueKey
          );
        }
      }
    };


    const isItemSelected = (product) => {
      const uniqueKey = `${product.savingsDeposit.fin_prdt_cd}_${product.options[0].intr_rate_type_nm}`;
      console.log("isItemSelected :" + uniqueKey)
      if (prdtDiv.value === "DE") {
        return selectedDepositList.value.some(
          (item) =>
            `${item.savingsDeposit.fin_prdt_cd}_${item.options[0].intr_rate_type_nm}` === uniqueKey
        );
      } else if (prdtDiv.value === "SA") {
        return selectedSavingsList.value.some(
          (item) =>
            `${item.savingsDeposit.fin_prdt_cd}_${item.options[0].intr_rate_type_nm}` === uniqueKey
        );
      }
      return false;
    };




    const isComparisonDisabled = computed(() => {
      if (prdtDiv.value === 'DE') {
        return selectedDepositList.value.length === 0 || selectedDepositList.value.length > 3;
      } else if (prdtDiv.value === 'SA') {
        return selectedSavingsList.value.length === 0 || selectedSavingsList.value.length > 3;
      }
      return true;
    });

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

    const showComparisonModal = () => {
      if (prdtDiv.value === 'DE') {
        console.log("selectedDepositList: ", selectedDepositList.value);
        if (selectedDepositList.value.length > 0 && selectedDepositList.value.length <= 3) {
          isComparisonModalVisible.value = true;
        }
      } else if (prdtDiv.value === 'SA') {
        console.log("selectedSavingsList: ", selectedSavingsList.value);
        if (selectedSavingsList.value.length > 0 && selectedSavingsList.value.length <= 3) {
          isComparisonModalVisible.value = true;
        }
      } else {
        console.warn("선택된 항목이 없거나 3개를 초과했습니다.");
      }
    };

    const closeModalAndResetSavingsDeposit = () => {
      isComparisonModalVisible.value = false;
      selectedDepositList.value = [];
      selectedSavingsList.value = [];
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      products,
      pageNumber,
      totalPages,
      selectedDepositList,
      selectedSavingsList,
      isComparisonModalVisible,
      previousPage,
      nextPage,
      showComparisonModal,
      closeModalAndResetSavingsDeposit,
      prdtDiv,
      setFilter,
      handleUpdateSelected,
      isComparisonDisabled,
      isItemSelected
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

.savings-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.compare-button {
  background-color: #3f72af;
  color: #f9f7f7;
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


/* 기존 스타일 및 추가된 스타일 */
.compare-button {
  background-color: #3f72af;
  color: #f9f7f7;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
}

.compare-button:hover {
  background-color: #2c5985;
}

.compare-button:disabled {
  background-color: #dbe2ef;
  color: #112d4e;
  cursor: not-allowed;
}

</style>