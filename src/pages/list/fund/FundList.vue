<template>
    <div>

        <!-- 각 펀드 항목을 반복적으로 출력 -->
        <div v-if="paginatedFunds.length">
            <Fund v-for="fund in paginatedFunds" :key="fund.prdNo" :fund="fund"/>
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

        
    </div>
</template>

<script>
import Fund from '@/components/list/fund/Fund.vue';

export default {
    components: {
        Fund,
    },
    data() {
        return {
            funds: [],           // 펀드 데이터를 담을 배열
            page: 1,             // 현재 페이지
            size: 5,            // 페이지당 항목 수
            totalPages: 0        // 전체 페이지 수
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
                const response = await fetch(`http://localhost:9000/finance/fund/pageAll?page=${this.page}&size=${this.size}`);  // API 호출 시 페이지와 크기 전달
                const data = await response.json();  // 응답 데이터를 JSON 형태로 파싱
                this.funds = data.funds;             // 가져온 펀드 데이터를 저장
                this.totalPages = data.totalPages;   // 전체 페이지 수 업데이트
            } catch (error) {
                console.error('펀드 데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        },
        fundItemClick(prdNo) {
            this.$router.push('/itemDetail/fund/' + prdNo);
            console.log(prdNo);
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
.fund-item {
    border: 1px solid #ddd;
    padding: 20px;
    margin: 20px auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
}

.fund-item h4 {
    font-size: 1.2em;
    margin-bottom: 15px;
}

.fund-item p {
    margin-bottom: 10px;
}

.button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.button-group button {
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}

.button-group .compare-btn {
    background-color: #6c757d;
    color: white;
}

.button-group .calculate-btn {
    background-color: #28a745;
    color: white;
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
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.pagination button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}

.pagination span {
    margin: 0 10px;
    font-weight: bold;
}
</style>
