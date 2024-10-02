<template>
  <div class="goal-manager">
    <h1>목표 관리</h1>

    <div v-if="!userProducts.length">
      <h2>목표 설정 필요</h2>
      <button @click="showSetGoalModal">목표 설정하기</button>
    </div>

    <div v-else>
      <h2>전체 목표 진행률</h2>
      <p>전체 목표 금액: {{ totalGoalAmount }}원</p>
      <p>선택한 예적금의 총 저축 금액: {{ totalSavedAmountFromProducts }}원</p>
      <progress :value="isFinite(overallProgressRate) ? overallProgressRate : 0" max="100">{{ overallProgressRate
        }}%</progress>

      <h2>선택한 예적금 상품 리스트</h2>
      <div v-for="product in userProducts" :key="product.id" class="goal-card">
        <h3>{{ product.goalName }}</h3>
        <p>상품명: {{ product.finPrdtNm }}</p>
        <p>현재까지 모은 금액: {{ product.savedAmount }}원</p>
        <p>이번 달 입금 금액: {{ product.monthlyDeposit }}원</p>
        <p>시작일: {{ formatDate(product.startDate) }}</p>
        <p>마감일: {{ formatDate(product.endDate) }}</p>
        <p>남은 기간: {{ remainingDays(product.endDate) }}일</p>
        <p>은행: <img :src="getIcon(product.bankname)" alt="Bank Icon" class="bankIcon" /></p>
        <p>필요한 월 입금액: {{ calculateMonthlyDeposit(product) }}원</p>
        <p>만기 시 수령액: {{ calculateMaturityAmount(product.savedAmount, 15.4, remainingDays(product.endDate),
          product.intrRateTypeNm) }}원</p>
        <progress :value="isFinite(calculateProductProgress(product)) ? calculateProductProgress(product) : 0"
          max="100">{{ calculateProductProgress(product) }}%</progress>
      </div>

      <button @click="showSetGoalModal">추가 목표 설정</button>
    </div>

    <!-- SetGoal 모달 -->
    <div v-if="isSetGoalModalVisible" class="modal show" @click.self="closeSetGoalModal">
      <div class="modal-content show">
        <SetGoal @goal-set="handleGoalSet" />
        <button @click="closeSetGoalModal">닫기</button>
      </div>
    </div>

    <!-- SelectSavings 모달 -->
    <div v-if="isSelectSavingsModalVisible" class="modal show" @click.self="closeSelectSavingsModal">
      <div class="modal-content show">
        <SelectProduct @product-selected="handleProductSelected" />
        <button @click="closeSelectSavingsModal">닫기</button>
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
    function calculateMaturityAmount(cost, interestRate, period, type_val) {
      interestRate = interestRate / 100; // 이자율을 소수점으로 변환
      var totalAmount = 0;

      if (type_val === "단리") { // 단리 (Simple Interest)
        // 단리 계산: A = P * (1 + r * n / 12)
        totalAmount = cost * (1 + (interestRate * period / 12));
      } else if (type_val === "복리") { // 월복리 (Compound Interest)
        // 복리 계산: A = P * (1 + r / 12)^n
        totalAmount = cost * Math.pow(1 + interestRate / 12, period);
      }

      return totalAmount; // 만기 금액 반환
    }


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
      closeSetGoalModal,
      showSelectSavingsModal,
      closeSelectSavingsModal,
      calculateProductProgress,
      calculateMonthlyDeposit, // Expose new method
      calculateMaturityAmount, // Expose new method
      remainingDays,
      formatDate,
      getIcon,
      loadIcons,
    };
  }
};
</script>

<style scoped>
.goal-manager {
  padding: 20px;
}

.goal-card {
  padding: 10px;
  margin: 15px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-30px);
  transition: transform 0.3s ease;
}

.modal.show {
  opacity: 1;
}

.modal-content.show {
  transform: translateY(0);
}

.bankIcon {
  width: 60px;
  height: auto;
  margin-right: 20px;
}
</style>