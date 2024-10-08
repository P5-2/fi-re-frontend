<template>
  <div class="select-product">
    <h2>상품 선택</h2>
    <div class="product-container">
      <ul class="product-list">
        <li v-for="product in filteredProducts" :key="product.finPrdtCd" class="product-item">
          <label class="product-label">
            <input
              type="radio"
              v-model="selectedProductId"
              :value="product.finPrdtCd"
              class="radio-input"
            />
            <span
              class="product-info"
              :class="{ 'selected': selectedProductId === product.finPrdtCd }"
            >
              <span class="product-name">{{ product.finPrdtNm }}</span> <br />
              <span class="company-name">{{ product.korCoNm }}</span><br />
              <span class="interest-rate">금리: {{ product.intrRate }}%</span>
            </span>
          </label>
        </li>
      </ul>
    </div>
    <button @click="selectProduct" class="submit-button" :disabled="!selectedProductId">
      선택 완료
    </button>
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
  max-width: 600px;
  margin: auto;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 400px;
}

.product-container {
  padding: 10px;
}

.product-list {
  padding: 0;
  list-style-type: none;
  margin: 0;
}

.product-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  transition: background-color 0.2s;
}

.product-item:hover {
  background-color: #f1f1f1;
}

.product-info.selected {
  background-color: #DBE2EF; /* 선택된 카드 색상 */
  border-color: #DBE2EF;
}

.product-label {
  display: flex;
  align-items: left;
  cursor: pointer;
}

.product-info {
  display: block;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: Arial, sans-serif;
  margin-bottom: 10px;
  width: 100%;
}
.product-info.selected {
  background-color: #DBE2EF; /* 선택된 카드 색상 */
  border-color: #DBE2EF;
}
.product-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.product-name:hover {
  color: #007BFF;
  /* 호버 시 색상 변경 */
}

.company-name {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.interest-rate {
  display: inline-block;
  padding: 5px 8px;
  background-color: #e0f7fa;
  color: #00796b;
  font-weight: bold;
  border-radius: 4px;
  font-size: 16px;
}

input[type="radio"] {
  margin-right: 10px;
  accent-color: #007BFF;
  /* Custom radio button color */
}

.submit-button {
  position: absolute; /* 절대 위치 */
  bottom: 15%; /* 상품 카드에서 20px 아래 */
  right: 37%;
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  z-index: 10; /* 모달창보다 낮은 z-index 설정 */
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.submit-button:not(:disabled):hover {
  background-color: #218838;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
.radio-input {
  display: none;
}
</style>