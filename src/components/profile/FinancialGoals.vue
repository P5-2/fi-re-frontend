<template>
  <div class="goal-manager">
    <h1>예적금으로 모으기</h1>

    <div v-if="!userProducts.length" class="no-goals">
      <h2>아직 목표가 없네요</h2>
      <p>지금 목표를 설정하고 저축을 시작해 보세요!</p>
      <button @click="showSetGoalModal" class="btn-primary">목표 설정하기</button>
    </div>

    <div v-else>
      <div class="overall-progress">
        <div class="progress-container">
          <div class="progress-bar-labels">
            <span>총 목표 금액: {{ formatCurrency(totalGoalAmount) }}원</span>
            <span>현재 저축 금액: {{ formatCurrency(totalSavedAmountFromProducts) }}원</span>
          </div>
          <progress :value="isFinite(overallProgressRate) ? overallProgressRate : 0" max="100"></progress>
          <p class="progress-text">{{ overallProgressRate }}% 달성</p>
        </div>
      </div>

      <div v-for="product in userProducts" :key="product.finPrdtCd" class="goal-card"
        :class="{ expanded: product.isExpanded }">
        <div class="goal-card-header" @click="toggleCard(product.finPrdtCd)">
          <div class="goal-icon">
            <img :src="getIcon(product.bankname)" alt="Bank Icon" class="bank-badge" />
          </div>
          <h3 class="goal-title">{{ product.goalName }} ({{ product.finPrdtNm }})</h3>
        </div>
        <div v-show="product.isExpanded" class="goal-details">
          <div class="goal-detail-items">
            <div class="goal-detail-item">
              <i class="fas fa-piggy-bank"></i>
              <p class="detail-text"><strong>지금까지</strong> <strong>{{ formatCurrency(product.savedAmount)
                  }}</strong><strong>원을 모았어요</strong></p>
            </div>
            <div class="goal-detail-item">
              <i class="fas fa-coins"></i>
              <p class="detail-text">
                <strong>이번 달에는</strong>
                <strong>{{ formatCurrency(product.monthlyDeposit) }}</strong>원을 모았어요
              </p>
            </div>
            <div class="goal-detail-item">
              <i class="fas fa-chart-line"></i>
              <p class="detail-text">
                <strong>이번달에는 </strong>
                <strong>{{ formatCurrency(calculateMonthlyDeposit(product)) }}</strong>
                <strong>원 더 저금할 수 있어요</strong>
              </p>
            </div>
          </div>
          <div class="progress-container">
            <div class="progress-info">
              <p><strong>시작일:</strong> {{ formatDate(product.startDate) }}</p>
              <p><strong>만기일:</strong> {{ formatDate(product.endDate) }}</p>
              <p><strong>남은 기간:</strong> {{ remainingDays(product.endDate) }}일</p>
            </div>
            <progress :value="isFinite(calculateProductProgress(product)) ? calculateProductProgress(product) : 0"
              max="100"></progress>
            <p class="progress-text">{{ calculateProductProgress(product) }}% 완료</p>
          </div>
          <button @click="showDeleteConfirmation(product)" class="delete-button">삭제</button>
        </div>
      </div>
      <button @click="showSetGoalModal" class="btn-primary">추가 목표 설정</button>
    </div>

    <div v-if="isSetGoalModalVisible" class="modal show" @click.self="closeSetGoalModal">
      <div class="modal-content show">
        <SetGoal @goal-set="handleGoalSet" />
        <button @click="closeSetGoalModal" class="btn-secondary">닫기</button>
      </div>
    </div>

    <div v-if="isSelectSavingsModalVisible" class="modal show" @click.self="closeSelectSavingsModal">
      <div class="modal-content show">
        <SelectProduct @product-selected="handleProductSelected" />
        <button @click="closeSelectSavingsModal" class="btn-secondary">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import SetGoal from './SetGoal.vue';
import SelectProduct from './SelectSavings.vue';
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useGoalStore } from '@/stores/GoalStore';
import DefaultIcon from '@/assets/bank/defaultbank.png';

export default {
  components: {
    SetGoal,
    SelectProduct
  },
  setup() {
    const goalStore = useGoalStore();
    const userProducts = ref([]);
    const isSetGoalModalVisible = ref(false);
    const isSelectSavingsModalVisible = ref(false);
    const iconMap = ref({});

    const updateUserProducts = async (shouldShowModal = false) => {
      const accessToken = goalStore.getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get('http://localhost:9000/profile/goal', config);

        if (Array.isArray(response.data)) {
          const uniqueProductsMap = new Map();

          response.data.forEach(product => {
            if (!uniqueProductsMap.has(product.finPrdtCd)) {
              uniqueProductsMap.set(product.finPrdtCd, {
                ...product,
                isExpanded: false,
              });
            }
          });

          userProducts.value = Array.from(uniqueProductsMap.values());
        } else {
          userProducts.value = [];
        }

        userProducts.value.forEach(product => {
          fetchDepositAmount(product.finPrdtCd);
        });

        goalStore.updateTotals(userProducts.value);

        if (userProducts.value.length === 0 && shouldShowModal) {
          showSetGoalModal();
        }
      } catch (error) {
        console.error('Error fetching user products:', error);
        userProducts.value = [];
      }
    };

    const toggleCard = (finPrdtCd) => {
      if (!finPrdtCd) {
        console.warn("finPrdtCd is undefined or null.");
        return;
      }

      userProducts.value = userProducts.value.map(product => {
        if (product.finPrdtCd !== undefined && product.finPrdtCd === finPrdtCd) {
          return {
            ...product,
            isExpanded: !product.isExpanded
          };
        } else {
          return {
            ...product,
            isExpanded: false 
          };
        }
      });
    };

    const fetchDepositAmount = async (prdNo) => {
      try {
        const accessToken = goalStore.getAccessToken();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const response = await axios.get(`http://localhost:9000/profile/goal/fetch/${prdNo}`, config);
        console.log(`Deposit amount for prdNo ${prdNo} updated:`, response.data);
      } catch (error) {
        console.error(`Error fetching deposit amount for prdNo ${prdNo}:`, error);
      }
    };

    const handleGoalSet = () => {
      updateUserProducts();
      closeSetGoalModal();
      showSelectSavingsModal();
    };

    const handleProductSelected = () => {
      updateUserProducts();
      closeSelectSavingsModal();
    };

    const getBankIcon = async (bankName) => {
      const formats = ['png', 'jpg'];
      for (const format of formats) {
        try {
          const icon = await import(`@/assets/bank/${bankName}.${format}`);
          return icon.default;
        } catch (error) {
          console.error(`Error loading icon for ${bankName}: ${error.message}`);
        }
      }
      return DefaultIcon;
    };

    const loadIcons = async () => {
      const banks = [
        '국민은행',
        '우리은행',
        '신한은행',
        '하나은행',
        '한국스탠다드차타드은행',
        '아이엠뱅크',
        '부산은행',
        '광주은행',
        '제주은행',
        '전북은행',
        '경남은행',
        '중소기업은행',
        '한국산업은행',
        '농협은행주식회사',
        '주식회사 케이뱅크',
        '수협은행',
        '주식회사 카카오뱅크',
        '토스뱅크 주식회사',
      ];

      const promises = banks.map(async (bank) => {
        iconMap.value[bank] = await getBankIcon(bank); 
      });

      await Promise.all(promises); 
    };

    const getIcon = (bname) => {
      return iconMap.value[bname] || DefaultIcon;
    };

    const showSetGoalModal = () => {
      isSetGoalModalVisible.value = true;
    };

    const closeSetGoalModal = () => {
      isSetGoalModalVisible.value = false;
    };

    const showSelectSavingsModal = () => {
      isSelectSavingsModalVisible.value = true;
    };

    const closeSelectSavingsModal = () => {
      isSelectSavingsModalVisible.value = false;
    };

    const calculateProductProgress = (product) => {
      const startDate = new Date(product.startDate);
      const endDate = new Date(product.endDate);
      const today = new Date();
      const totalDuration = endDate - startDate;
      const passedDuration = today - startDate;
      if (totalDuration <= 0 || passedDuration <= 0) return 0;
      return Math.min(((passedDuration / totalDuration) * 100).toFixed(0), 100);
    };

    // 적금 월 불입액 계산
    const calculateMonthlyDeposit = (product) => {
      if (typeof product.targetAmount === 'number' && typeof product.savedAmount === 'number' && typeof remainingMonths(product.endDate) === 'number') {
        const remainingAmount = product.targetAmount - product.savedAmount;
        const remainingMonthlyAmount = (remainingAmount / remainingMonths(product.endDate)) - product.monthlyDeposit;
        
        if (remainingMonths(product.endDate) > 0) {
          return remainingMonthlyAmount.toFixed(0);
        } else {
          return 0; 
        }
      }
      return 0;
    };

    // 만기시 총액 계산
    function calculateMaturityAmount(product) {
      const principal = product.savedAmount; 
      const interestRate = ((product.minRate + product.maxRate) / 2) / 100; // 이자율 합산 후 소수점으로 변환
      const period = remainingMonths(product.endDate); // 남은 기간을 월 단위로 계산
      const interestType = product.intrRateTypeNm;
      const taxRate = 0.154; // 세율 15.4%
      let maturityAmount = 0;

      if (interestType === "단리") {
        // 단리 계산: A = P * (1 + r * n / 12)
        maturityAmount = principal * (1 + (interestRate * period / 12));
      } else if (interestType === "복리") {
        // 복리 계산: A = P * (1 + r / 12)^n
        maturityAmount = principal * Math.pow(1 + interestRate / 12, period);
      }

      // 세금 적용 후 금액 계산 (이자에 대해서만 세금 적용)
      const interestGained = maturityAmount - principal; // 발생 이자
      const taxedInterest = interestGained * (1 - taxRate); // 세금 적용된 이자
      const finalAmount = principal + taxedInterest; // 원금 + 세금 적용된 이자

      return finalAmount.toFixed(2); // 소수점 2자리까지 반올림하여 반환
    }

    const deleteMemberSavings = async (prdNo) => {
      try {
        const accessToken = goalStore.getAccessToken();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.delete(`http://localhost:9000/profile/goal/${prdNo}`, config);

        if (response.status === 200) {
          await updateUserProducts();
          alert('삭제가 완료되었습니다.');
        }
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    };

    const showDeleteConfirmation = (product) => {
      const prdNo = product.finPrdtCd;
      if (confirm('정말로 삭제하시겠습니까?')) {
        if (prdNo) {
          deleteMemberSavings(prdNo);
        } else {
          alert('상품 번호가 유효하지 않습니다.');
        }
      }
    };

    const overallProgressRate = computed(() => {
      if (goalStore.totalGoalAmount === 0) return 0;
      return Math.min(((goalStore.totalSavedAmount / goalStore.totalGoalAmount) * 100).toFixed(2), 100);
    });

    const totalSavedAmountFromProducts = computed(() => {
      return userProducts.value.reduce((total, product) => total + (product.savedAmount || 0), 0);
    });

    const remainingDays = (endDate) => {
      const today = new Date();
      const end = new Date(endDate);
      const remainingTime = end - today;
      return Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    };

    const remainingMonths = (endDate) => {
      const today = new Date();
      const end = new Date(endDate);

      if (end <= today) {
        return 0;
      }

      const yearsDifference = end.getFullYear() - today.getFullYear();
      const monthsDifference = end.getMonth() - today.getMonth();

      let remainingMonths = yearsDifference * 12 + monthsDifference;

      if (end.getDate() > today.getDate()) {
        remainingMonths++;
      }

      return remainingMonths;
    };


    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    const formatCurrency = (amount) => {
      if (amount != undefined)
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const totalGoalAmount = computed(() => goalStore.totalGoalAmount);
    const totalSavedAmount = computed(() => goalStore.totalSavedAmount);

    onMounted(async () => {
      loadIcons();
      updateUserProducts(true);
    });

    return {
      // 상태 관리
      userProducts,
      isSetGoalModalVisible,
      isSelectSavingsModalVisible,

      // 목표 금액 관련
      totalGoalAmount,
      totalSavedAmount,
      totalSavedAmountFromProducts,
      overallProgressRate,

      // 메서드
      handleGoalSet,
      handleProductSelected,
      showSetGoalModal,
      showDeleteConfirmation,
      closeSetGoalModal,
      showSelectSavingsModal,
      closeSelectSavingsModal,
      toggleCard,
      fetchDepositAmount,

      // 계산 관련 메서드
      calculateProductProgress,
      calculateMonthlyDeposit,
      calculateMaturityAmount,

      // 날짜 관련 메서드
      remainingDays,
      remainingMonths,
      formatDate,

      // 통화 포맷팅
      formatCurrency,

      // 아이콘 관련 메서드
      getIcon,
      loadIcons,
    };
  }
};
</script>

<style scoped>
.goal-manager {
  font-family: 'Arial', sans-serif;
  color: #333;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1,
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2C3E50;
}

.no-goals {
  text-align: center;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-goals h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 15px;
  border-radius: 25px;
  background-color: #007BFF;
  color: #fff;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.overall-progress {
  background-color: #ecf0f1;
  padding: 2px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  color: #34495e;
}

progress {
  width: 100%;
  height: 20px;
  border-radius: 10px;
  margin-top: 10px;
  background-color: #ecf0f1;
}

progress::-webkit-progress-value {
  background-color: #3498db;
  border-radius: 10px;
}

.goal-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.goal-card.expanded {
  border: 2px solid #143959;
  height: auto;
}

.goal-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.goal-card.expanded .goal-icon {
  width: 70px;
  height: 70px;
}

.goal-card-header {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.goal-card-header:hover {
  background-color: #e2e6ea;
}

.goal-card-header h3 {
  margin-left: 15px;
  color: #2C3E50;
}

.goal-detail-items {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.goal-detail-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  background-color: #f0f4f8;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.goal-detail-item:hover {
  background-color: #e9eff1;
}

.goal-detail-item i {
  color: #000000;
  margin-right: 8px;
}

.detail-text {
  margin: 5px 0;
  color: #495057;
  font-size: 0.95em;
}

.goal-details {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
}

.goal-detail-item:last-child {
  margin-right: 0;
}

.goal-details-enter-active {
  max-height: 500px;
}

.goal-details-leave-active {
  max-height: 0;
}

.goal-card.expanded .goal-details {
  max-height: 500px;
  opacity: 1;
}

.goal-details p {
  margin: 5px 0;
}

.progress-container {
  margin: 15px 0;
  background-color: #ecf0f1;
  border-radius: 8px;
  padding: 10px;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #c0392b;
}

.modal.show {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content.show {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-text {
  text-align: right;
  font-size: 0.9em;
  color: #2980b9;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  margin-top: 10px;
}

.bank-badge {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 10px;
}

.goal-title {
  font-size: 1.6em;
  font-weight: 550;
  color: #333;
  margin: 0;
}

@media (max-width: 600px) {
  .goal-manager {
    padding: 10px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .goal-card {
    padding: 10px;
    flex-direction: column;
  }
}
</style>