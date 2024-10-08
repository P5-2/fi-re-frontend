<template>
  <div class="fund-container">
    <!-- 비교하기 버튼 -->
    <button
      class="compare-button"
      @click="showComparisonModal"
      :disabled="selectedFunds.length === 0 || selectedFunds.length > 3"
    >
      비교하기 ({{ selectedFunds.length }}/3)
    </button>

    <!-- 각 펀드 항목을 반복적으로 출력 -->
    <div v-if="paginatedFunds.length">
      <Fund
        v-for="fund in paginatedFunds"
        :key="fund.prdNo"
        :fund="fund"
        @select-fund="handleSelectFund"
      />
    </div>

    <!-- 데이터가 없을 때 표시할 메시지 -->
    <div v-else>
      <p>펀드 데이터를 가져오는 중입니다...</p>
    </div>

    <!-- 페이지네이션 컨트롤 -->
    <div class="pagination">
      <button @click="previousPage" :disabled="page === 1">이전</button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages">다음</button>
    </div>

    <!-- 비교 모달 컴포넌트 -->
    <ComparisonModal
      :selectedFunds="selectedFunds"
      :isComparisonModalVisible="isComparisonModalVisible"
      @close="closeModalAndResetFunds"
    />
  </div>
</template>

<script>
import Fund from '@/components/list/fund/Fund.vue';
import ComparisonModal from '@/components/comparison/ComparisonModalFund.vue';

import axios from 'axios'; // axios 추가
export default {
  components: {
    Fund,
    ComparisonModal,
  },
  data() {
    return {
      funds: [], // 펀드 데이터를 담을 배열
      selectedFunds: [], // 선택된 펀드 항목을 담을 배열
      page: 1, // 현재 페이지
      size: 5, // 페이지당 항목 수
      totalPages: 0, // 전체 페이지 수
      isComparisonModalVisible: false, // 비교 모달 표시 여부
    };
  },
  computed: {
    paginatedFunds() {
      return this.funds;
    },
  },
  methods: {
    async trackPageVisit() {
      try {
        const tokenData = JSON.parse(sessionStorage.getItem('token'));
        const accessToken = tokenData?.accessToken;

        await axios.post(
          `http://localhost:9000/exp`,
          {
            page: 'fundlist', // 현재 페이지 이름
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        console.error('Error tracking page visit:', error);
      }
    },

    
        async fetchFunds() {
            try {
                const response = await fetch(`http://localhost:9000/finance/fund/pageAll?page=${this.page}&size=${this.size}`);
                const data = await response.json();
                this.funds = data.funds;             // 가져온 펀드 데이터를 저장
                this.totalPages = data.totalPages;   // 전체 페이지 수 업데이트
                this.loadSelectedFunds();
            } catch (error) {
                console.error('펀드 데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        },
        handleSelectFund({ fund, selected }) {
            if (selected) {
                if (this.selectedFunds.length < 3) {
                    this.selectedFunds.push(fund);
                } else {
                   // alert("최대 3개의 펀드만 선택할 수 있습니다.");
                    return;
                }
            } else {
                this.selectedFunds = this.selectedFunds.filter(f => f.prdNo !== fund.prdNo);
            }
        },
        showComparisonModal() {
            if (this.selectedFunds.length > 0 && this.selectedFunds.length <= 3) {
                this.isComparisonModalVisible = true;
            }
        },
        closeModalAndResetFunds() {
            this.isComparisonModalVisible = false;
            this.clearLocalStorage();  // 모달이 닫힐 때 로컬스토리지 값 제거
            window.location.href = '/fund';
        },
        clearLocalStorage() {
            localStorage.removeItem('checkedFunds');  // 로컬스토리지 값 삭제
            this.selectedFunds=[];
        },
        loadSelectedFunds() {
            // localStorage에서 checkedFunds 가져오기
            const checkFund = JSON.parse(localStorage.getItem('checkedFunds')) || [];

            // checkedFunds에서 prdNo 값만 추출
            checkFund.map(fund => fund.prdNo);

            // 현재 로드된 funds 중 checkFundPrdNos에 해당하는 펀드만 selectedFunds에 추가
            this.selectedFunds = checkFund;
        },
        previousPage() {
            if (this.page > 1) {
                this.page--;
                this.fetchFunds();
            }
        },
        nextPage() {
            if (this.page < this.totalPages) {
                this.page++;
                this.fetchFunds();
            }
        }
    },
    mounted() {
        this.fetchFunds();  // 컴포넌트가 마운트되면 펀드 데이터를 가져옴
        
    }
};
</script>

<style scoped>
.fund-container {
  width: 100%;
  max-width: 1200px; /* 페이지가 너무 넓어지지 않도록 최대 너비를 제한 */
  margin: 0 auto; /* 중앙 정렬 */
  padding: 0 20px; /* 양쪽 패딩을 추가해 화면과의 간격을 확보 */
}

/* 기존 compare-button, pagination 등의 스타일은 유지 */
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
