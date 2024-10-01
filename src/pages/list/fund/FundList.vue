<template>
    <div class="fund-container">
        <!-- 비교하기 버튼 -->
        <button class="compare-button" @click="showComparisonModal" :disabled="selectedFunds.length === 0 || selectedFunds.length > 3">
            비교하기 ({{ selectedFunds.length }}/3)
        </button>

        <!-- 각 펀드 항목을 반복적으로 출력 -->
        <div v-if="paginatedFunds.length">
            <Fund v-for="fund in paginatedFunds" :key="fund.prdNo" :fund="fund" @select-fund="handleSelectFund" />
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
        <ComparisonModal :selectedFunds="selectedFunds" :isComparisonModalVisible="isComparisonModalVisible"
            @close="isComparisonModalVisible = false" />
    </div>
</template>


<script>
import Fund from '@/components/list/fund/Fund.vue';
import ComparisonModal from '@/components/comparison/ComparisonModal.vue';

export default {
    components: {
        Fund,
        ComparisonModal
    },
    data() {
        return {
            funds: [],             // 펀드 데이터를 담을 배열
            selectedFunds: [],     // 선택된 펀드 항목을 담을 배열
            page: 1,               // 현재 페이지
            size: 5,               // 페이지당 항목 수
            totalPages: 0,         // 전체 페이지 수
            isComparisonModalVisible: false  // 비교 모달 표시 여부
        };
    },
    computed: {
        paginatedFunds() {
            return this.funds;
        }
    },
    methods: {
        async fetchFunds() {
            try {
                const response = await fetch(`http://localhost:9000/finance/fund/pageAll?page=${this.page}&size=${this.size}`);
                const data = await response.json();
                this.funds = data.funds;             // 가져온 펀드 데이터를 저장
                this.totalPages = data.totalPages;   // 전체 페이지 수 업데이트
            } catch (error) {
                console.error('펀드 데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        },
        handleSelectFund({ fund, selected }) {
            if (selected) {
                if (this.selectedFunds.length < 3) {
                    this.selectedFunds.push(fund);
                } else {
                    alert("최대 3개의 펀드만 선택할 수 있습니다.");
                }
            } else {
                this.selectedFunds = this.selectedFunds.filter(f => f.prdNo !== fund.prdNo);
            }
        },
        showComparisonModal() {
            if (this.selectedFunds.length > 0 && this.selectedFunds.length <= 3) {
                this.isComparisonModalVisible = true;
                console.log('모달이 열려야 합니다.', this.isComparisonModalVisible); // 디버깅용 로그
            }
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
    margin: 0 auto;    /* 중앙 정렬 */
    padding: 0 20px;   /* 양쪽 패딩을 추가해 화면과의 간격을 확보 */
}

/* 기존 compare-button, pagination 등의 스타일은 유지 */
.compare-button {
    background-color: #3F72AF;
    color: #F9F7F7;
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
    background-color: #2C5985;
}

.compare-button:disabled {
    background-color: #DBE2EF;
    color: #112D4E;
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
    background-color: #3F72AF;
    color: #F9F7F7;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pagination button:hover {
    background-color: #2C5985;
}

.pagination button:disabled {
    background-color: #DBE2EF;
    color: #112D4E;
    cursor: not-allowed;
}

.pagination span {
    margin: 0 10px;
    font-weight: bold;
}

</style>

