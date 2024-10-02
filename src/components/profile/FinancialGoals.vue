<template>
  <div class="goal-manager">
    <h1>나의 목표 관리</h1>

    <div v-if="!userProducts.length" class="no-goals">
      <h2>아직 목표가 없네요</h2>
      <p>지금 목표를 설정하고 저축을 시작해 보세요!</p>
      <button @click="showSetGoalModal" class="btn-primary">목표 설정하기</button>
    </div>

    <div v-else>
      <div class="overall-progress">
        <h2>전체 목표 진행 상황</h2>
        <div class="progress-container">
          <div class="progress-bar-labels">
            <span>총 목표 금액: {{ formatCurrency(totalGoalAmount) }}</span>
            <span>현재 저축 금액: {{ formatCurrency(totalSavedAmountFromProducts) }}</span>
          </div>
          <progress :value="isFinite(overallProgressRate) ? overallProgressRate : 0" max="100"></progress>
          <p class="progress-text">{{ overallProgressRate }}% 달성</p>
        </div>
      </div>

      <h2>가입한 예적금 상품</h2>
      <div v-for="product in userProducts" :key="product.id" class="goal-card">
        <div class="goal-card-header" @click="toggleCard(product.id)">
          <img :src="getIcon(product.bankname)" alt="Bank Icon" class="bank-badge" />
          <h3>{{ product.goalName }} ({{ product.finPrdtNm }})</h3>
        </div>
        <transition name="slide">
          <div v-if="product.isExpanded" class="goal-details">
            <p><strong>현재 저축액:</strong> {{ formatCurrency(product.savedAmount) }}</p>
            <p><strong>이번 달 입금액:</strong> {{ formatCurrency(product.monthlyDeposit) }}</p>
            <p><strong>필요한 월 저축액:</strong> {{ formatCurrency(calculateMonthlyDeposit(product)) }}</p>
            <p><strong>시작일:</strong> {{ formatDate(product.startDate) }}</p>
            <p><strong>마감일:</strong> {{ formatDate(product.endDate) }}</p>
            <p><strong>남은 기간:</strong> {{ remainingDays(product.endDate) }}일</p>
            <p><strong>만기 시 예상 수령액:</strong> {{ formatCurrency(calculateMaturityAmount(product)) }}</p>
          </div>
        </transition>
        <div class="progress-container">
          <progress :value="isFinite(calculateProductProgress(product)) ? calculateProductProgress(product) : 0"
            max="100"></progress>
          <p class="progress-text">{{ calculateProductProgress(product) }}% 달성</p>
        </div>
        <button @click="showDeleteConfirmation(product)">삭제</button>
      </div>

      <button @click="showSetGoalModal" class="btn-primary">추가 목표 설정</button>
    </div>

    <!-- SetGoal 모달 -->
    <div v-if="isSetGoalModalVisible" class="modal show" @click.self="closeSetGoalModal">
      <div class="modal-content show">
        <SetGoal @goal-set="handleGoalSet" />
        <button @click="closeSetGoalModal" class="btn-secondary">닫기</button>
      </div>
    </div>

    <!-- SelectSavings 모달 -->
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
  methods: {
    toggleCard(productId) {
      const product = this.userProducts.find(p => p.id === productId);
      product.isExpanded = !product.isExpanded;
    },
  },
  setup() {
    const goalStore = useGoalStore();
    const userProducts = ref([]);
    const isSetGoalModalVisible = ref(false);
    const isSelectSavingsModalVisible = ref(false);
    const iconMap = ref({});

    const checkUserProducts = async () => {
      const accessToken = goalStore.getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get('http://localhost:9000/profile/goal', config);
        userProducts.value = Array.isArray(response.data) ? response.data : [];
        goalStore.updateTotals(userProducts.value);
        if (userProducts.value.length === 0) {
          showSetGoalModal();
        }
      } catch (error) {
        console.error('Error fetching user products:', error);
        userProducts.value = [];
      }
    };

    const refreshUserProducts = async () => {
      const accessToken = goalStore.getAccessToken();
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      try {
        const response = await axios.get('http://localhost:9000/profile/goal', config);
        userProducts.value = Array.isArray(response.data) ? response.data : [];
        goalStore.updateTotals(userProducts.value);
      } catch (error) {
        console.error('Error refreshing user products:', error);
        userProducts.value = [];
      }
    };

    const handleGoalSet = (goal) => {
      refreshUserProducts();
      closeSetGoalModal();
      showSelectSavingsModal();
    };

    const handleProductSelected = (product) => {
      refreshUserProducts();
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
      return DefaultIcon; // 모든 형식에서 아이콘이 없으면 기본 아이콘 반환
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
        iconMap.value[bank] = await getBankIcon(bank); // 아이콘을 iconMap에 저장
      });

      await Promise.all(promises); // 모든 아이콘 로드 완료 대기
    };

    const getIcon = (bname) => {
      return iconMap.value[bname] || DefaultIcon; // 기본 아이콘
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
      return Math.min(((passedDuration / totalDuration) * 100).toFixed(2), 100);
    };

    // 적금 월 불입액 계산
    const calculateMonthlyDeposit = (product) => {
      // 
      // 모든 값이 유효한 숫자인지 확인
      if (typeof product.targetAmount === 'number' && typeof product.savedAmount === 'number' && typeof remainingMonths(product.endDate) === 'number') {
        const remainingAmount = product.targetAmount - product.savedAmount;

        // 남은 개월이 0보다 큰지 확인하여 나눗셈 오류 방지
        if (remainingMonths(product.endDate) > 0) {
          return (remainingAmount / remainingMonths(product.endDate)).toFixed(2);
        } else {
          return 0; // 남은 기간이 없으면 0 반환
        }
      }
      return 0; // 유효하지 않은 값이면 0 반환
    };

    // 만기시 총액 계산
    function calculateMaturityAmount(product) {
      const principal = product.savedAmount; // 원금
      const interestRate = ((product.minRate + product.maxRate) / 2) / 100; // 이자율 합산 후 소수점으로 변환
      const period = remainingMonths(product.endDate); // 남은 기간을 월 단위로 계산
      const interestType = product.intrRateTypeNm; // 이자 계산 방식
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

    // 삭제 메서드
    const deleteMemberSavings = async (prdNo) => {
      try {
        const accessToken = goalStore.getAccessToken();
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.delete(`http://localhost:9000/profile/goal/${prdNo}`, config);

        // 성공적으로 삭제된 경우
        if (response.status === 200) {
          // 상품 목록 갱신
          await refreshUserProducts();
          alert('삭제가 완료되었습니다.'); // 성공 메시지 표시
        }
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.'); // 오류 메시지 표시
      }
    };

    // UI에 삭제 버튼 추가 및 삭제 확인
    const showDeleteConfirmation = (product) => {
      const prdNo = product.finPrdtCd; // 제품 번호
      if (confirm('정말로 삭제하시겠습니까?')) {
        if (prdNo) {
          deleteMemberSavings(prdNo);
        } else {
          alert('상품 번호가 유효하지 않습니다.'); // 유효하지 않은 상품 번호 경고
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

      // 종료일이 오늘보다 이전이면 0 반환
      if (end <= today) {
        return 0;
      }

      // 종료일과 현재 날짜 사이의 연도 차이와 월 차이를 계산
      const yearsDifference = end.getFullYear() - today.getFullYear();
      const monthsDifference = end.getMonth() - today.getMonth();

      // 총 남은 개월 수를 계산
      let remainingMonths = yearsDifference * 12 + monthsDifference;

      // 만약 종료일이 현재 날짜보다 이후일 경우, 추가로 1개월을 더함
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
      return amount.toLocaleString() + '원';
    };

    const totalGoalAmount = computed(() => goalStore.totalGoalAmount);
    const totalSavedAmount = computed(() => goalStore.totalSavedAmount);

    onMounted(() => {
      loadIcons();
      checkUserProducts();
    });

    return {
      userProducts,
      isSetGoalModalVisible,
      isSelectSavingsModalVisible,
      totalGoalAmount,
      totalSavedAmount,
      totalSavedAmountFromProducts,
      overallProgressRate,
      handleGoalSet,
      handleProductSelected,
      showSetGoalModal,
      showDeleteConfirmation,
      closeSetGoalModal,
      showSelectSavingsModal,
      closeSelectSavingsModal,
      calculateProductProgress,
      calculateMonthlyDeposit,
      calculateMaturityAmount,
      remainingDays,
      formatCurrency,
      formatDate,
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
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-container {
  margin-top: 10px;
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
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
}

.goal-card:hover {
  transform: translateY(-5px);
}

.goal-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.goal-card-header img.bank-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.goal-card h3 {
  font-size: 1.2em;
  margin: 0;
}

.goal-details {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 0.3s ease, max-height 0.3s ease;
}

.goal-card.expanded .goal-details {
  max-height: 300px;
  opacity: 1;
}

.goal-details p {
  margin: 5px 0;
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

.bank-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
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
  }
}
</style>
