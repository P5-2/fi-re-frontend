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
        const savingsResponse = await axios.get('http://localhost:9000/finance/savingsDeposit/savings/all', config);
        const depositResponse = await axios.get('http://localhost:9000/finance/savingsDeposit/deposit/all', config);
        return [...savingsResponse.data, ...depositResponse.data];
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

        // response.data가 배열인지 확인
        if (Array.isArray(response.data)) {
          memberSavings.value = response.data.map(item => item.finPrdtCd); // 가입한 상품 코드만 추출
        } else {
          console.error('Expected response.data to be an array:', response.data);
          memberSavings.value = []; // 배열이 아닐 경우 빈 배열로 초기화
        }
      } catch (error) {
        console.error('Error fetching member savings:', error);
        memberSavings.value = [];
      }
    };

    const loadProducts = async () => {
      await fetchMemberSavings(); // 가입한 상품 데이터 먼저 가져오기
      const products = await fetchProducts();
      // 가입한 상품을 제외한 필터링
      filteredProducts.value = products.filter(product => !memberSavings.value.includes(product.finPrdtCd));
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