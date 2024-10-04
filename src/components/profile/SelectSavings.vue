<template>
  <div class="select-product">
    <h2>상품 선택</h2>
    <ul>
      <li v-for="product in filteredProducts" :key="product.finPrdtCd">
        <label>
          <input type="radio" v-model="selectedProductId" :value="product.finPrdtCd" />
          {{ product.finPrdtNm }} (금리: {{ product.intrRate }}%)
        </label>
      </li>
    </ul>
    <button @click="selectProduct" :disabled="!selectedProductId">선택 완료</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useGoalStore } from '@/stores/GoalStore';

export default {
  setup(_, { emit }) {
    const goalStore = useGoalStore();
    const selectedProductId = ref(null);
    const filteredProducts = ref([]);
    const memberSavings = ref([]);

    const fetchProducts = async () => {
      const accessToken = goalStore.getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const savingsResponse = await axios.get('http://localhost:9000/recommend/deposit', config);
        const depositResponse = await axios.get('http://localhost:9000/recommend/savings', config);
        return [...savingsResponse.data.savingsDeposits, ...depositResponse.data.savingsDeposits];
      } catch (error) {
        console.error('Error fetching products:', error);
        alert('상품을 불러오는 데 실패했습니다.');
        return [];
      }
    };

    const fetchMemberSavings = async () => {
      const accessToken = goalStore.getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get('http://localhost:9000/profile/goal', config);
        if (Array.isArray(response.data)) {
          memberSavings.value = response.data.map(item => item.finPrdtCd);
        } else {
          console.error('Expected response.data to be an array:', response.data);
          memberSavings.value = [];
        }
      } catch (error) {
        console.error('Error fetching member savings:', error);
        memberSavings.value = [];
      }
    };

    const loadProducts = async () => {
      await fetchMemberSavings();
      const products = await fetchProducts();
      // 중복된 finPrdtCd 제거
      const uniqueProducts = Array.from(new Set(products.map(product => product.finPrdtCd)))
        .map(finPrdtCd => products.find(product => product.finPrdtCd === finPrdtCd));
      filteredProducts.value = uniqueProducts.filter(product => !memberSavings.value.includes(product.finPrdtCd));
    };

    const selectProduct = async () => {
      if (selectedProductId.value) {
        const selectedProduct = filteredProducts.value.find(product => product.finPrdtCd === selectedProductId.value);
        const today = new Date().toISOString().slice(0, 10);
        const accessToken = goalStore.getAccessToken();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        try {
          await axios.post('http://localhost:9000/profile/setgoal', {
            goalName: goalStore.currentGoal.goalName,
            finPrdtCd: selectedProduct.finPrdtCd,
            finPrdtNm: selectedProduct.finPrdtNm,
            startDate: today,
            savedAmount: 0,
            monthlyDeposit: 0,
            targetAmount: goalStore.currentGoal.targetAmount,
            saveTrm: selectedProduct.saveTrm
          }, config);

          goalStore.setSelectedProduct({
            ...selectedProduct,
            startDate: today,
            savedAmount: 0,
            monthlyDeposit: 0
          });

          emit('product-selected', {
            ...selectedProduct,
            startDate: today,
            savedAmount: 0,
            monthlyDeposit: 0
          });

          selectedProductId.value = null;
        } catch (error) {
          console.error('상품 선택 실패:', error);
        }
      }
    };

    onMounted(() => {
      loadProducts();
    });

    return {
      filteredProducts,
      selectedProductId,
      selectProduct
    };
  }
};
</script>

<style scoped>
.select-product {
  padding: 20px;
}
</style>
