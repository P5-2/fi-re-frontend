<template>
    <div>
        
        <!-- 각 펀드 항목을 반복적으로 출력 -->
        <div v-if="funds.length">
            <div v-for="fund in funds" :key="fund.prdNo" class="fund-item" @click="fundItemClick">
                <h2>{{ fund.pname }} ({{ fund.region }})</h2>
                <p>수익률: {{ fund.rate }}%</p>
                <p>위험 등급: {{ fund.dngrGrade }}</p>
                <p>유형: {{ fund.type }}</p>
                <p>기준 날짜: {{ formatDate(fund.bseDt) }}</p>
            </div>
        </div>
        <!-- 데이터가 없을 때 표시할 메시지 -->
        <div v-else>
            <p>펀드 데이터를 가져오는 중입니다...</p>
        </div>
    </div>
</template>

<script>
import Fund from '@/components/list/fund/Fund.vue';
export default {
    data() {
        return {
            funds: [],  // 펀드 데이터를 담을 배열
        };
    },
    created() {
        this.fetchFunds();  // 컴포넌트가 생성될 때 API 호출
    },
    
    methods: {
        // API로부터 펀드 데이터를 가져오는 메소드
        async fetchFunds() {
            try {
                const response = await fetch('http://localhost:9000/finance/fund/all');  // API 호출
                this.funds = await response.json();  // 응답 데이터를 JSON 형태로 파싱
            } catch (error) {
                console.error('펀드 데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        },
        // 날짜 포맷팅 메소드 (YYYY-MM-DD 형식)
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString('ko-KR', options);
        },
        fundItemClick(){
            this.$router.push('/itemDetail/fund/'+this.prdNo)
            console.log(this.prdNo);
        }
    },
};
</script>

<style>
body {
    font-family: Arial, sans-serif;
}

h1 {
    text-align: center;
    margin-top: 20px;
}

.fund-item {
    border: 1px solid #ddd;
    padding: 20px;
    margin: 10px auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    max-width: 600px;
}

.fund-item h2 {
    margin: 0;
    font-size: 1.5em;
    color: #333;
}

.fund-item p {
    margin: 5px 0;
    color: #666;
}
</style>