<template>
    <div v-if="isComparisonModalVisible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>적금 상품 비교 및 수익 계산</h3>
            </div>

            <div class="modal-body">
                <div class="investment-calculator">
                    <div class="calculator-header">
                        <select v-model="selectedSavingsId" class="styled-select">
                            <option v-for="savings in selectedSavingsWithOptions"
                                :key="savings.savingsDeposit.fin_prdt_cd + '-' + savings.options[0].intr_rate_type_nm + '-' + savings.savingsDeposit.save_trm"
                                :value="savings.savingsDeposit.fin_prdt_cd">
                                {{ savings.savingsDeposit.fin_prdt_nm }} ({{ savings.savingsDeposit.kor_co_nm }})-({{
                                    savings.options[0].intr_rate_type_nm }})
                            </option>


                        </select>
                        <span>에 기간</span>
                        <select v-model="investmentPeriod" class="styled-select">
                            <option value="6">6개월</option>
                            <option value="12">1년</option>
                            <option value="24">2년</option>
                            <option value="36">3년</option>
                        </select>
                        <span>매월</span>
                        <select v-model="monthlyInvestment" class="styled-select">
                            <option value="100000">10만원</option>
                            <option value="300000">30만원</option>
                            <option value="500000">50만원</option>
                        </select>
                        <span>씩 투자했다면?</span>
                    </div>

                    <div class="calculator-result">
                        <div class="result-item">
                            <span>총 투자금액</span>
                            <h1>{{ totalInvestment.toLocaleString() }}원</h1>
                        </div>
                        <div class="result-item">
                            <span>예상 이자</span>
                            <h1>{{ formatNumber(interestEarned) }}원</h1>
                        </div>
                    </div>
                </div>



                <!-- 표 구조 개선 -->
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>상품명</th>
                            <th>기간</th>
                            <th>기본 금리</th>
                            <th>최고 금리</th>
                        </tr>
                    </thead>
                    <tbody v-if="selectedSavingsDetail && selectedSavingsDetail.options">
                        <!-- 각 기간별로 행을 분리하여 출력 -->
                        <tr v-for="(option, index) in selectedSavingsDetail.options" :key="index">
                            <td>{{ selectedSavingsDetail.savingsDeposit.fin_prdt_nm }} ({{
                                selectedSavingsDetail.savingsDeposit.kor_co_nm }})</td>
                            <td>{{ option.save_trm }}개월</td>
                            <td>{{ option.intr_rate ? option.intr_rate : '-' }}%</td>
                            <td>{{ option.intr_rate2 ? option.intr_rate2 : '-' }}%</td>
                        </tr>
                    </tbody>

                </table>


                <!-- 선택된 상품의 상세 정보 -->
                <div v-if="selectedSavingsId && selectedSavingsDetail" class="selected-savings-details">
                    <h4>선택된 상품 상세 정보</h4>
                    <p><strong>금융사:</strong> {{ selectedSavingsDetail.savingsDeposit.kor_co_nm }}</p>
                    <p><strong>상품명:</strong> {{ selectedSavingsDetail.savingsDeposit.fin_prdt_nm }}</p>
                    <p><strong>가입방법:</strong> {{ selectedSavingsDetail.savingsDeposit.join_way }}</p>
                    <p><strong>우대조건:</strong> {{ selectedSavingsDetail.savingsDeposit.spcl_cnd }}</p>
                    <p><strong>가입대상:</strong> {{ selectedSavingsDetail.savingsDeposit.join_member }}</p>
                </div>
            </div>

            <div class="modal-footer">
                <button class="close-btn" @click="closeModal">닫기</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        selectedSavings: {
            type: Array,
            required: true
        },
        isComparisonModalVisible: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            selectedSavingsId: null, // 선택된 적금 상품 ID
            investmentPeriod: 6, // 기본 6개월 설정
            monthlyInvestment: 100000 // 기본 10만원 설정
        };
    },
    computed: {
        // 필터링된 적금 배열을 반환하여 v-for에 사용
        selectedSavingsWithOptions() {
            return this.selectedSavings.filter(savings => Array.isArray(savings.options) && savings.options.length > 0);
        },
        selectedSavingsDetail() {
            // 선택된 상품의 상세 정보 반환
            return this.selectedSavings.find(
                savings => savings.savingsDeposit.fin_prdt_cd === this.selectedSavingsId
            );
        },
        totalInvestment() {
            return this.monthlyInvestment * this.investmentPeriod;
        },
        interestEarned() {
            if (this.selectedSavingsDetail && this.selectedSavingsDetail.options && this.selectedSavingsDetail.options.length > 0) {
                const interestRate = parseFloat(this.selectedSavingsDetail.options[0].intr_rate2) / 100;
                return (this.totalInvestment * interestRate).toFixed(2);
            }
            return 0;
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        formatNumber(value) {
            return parseFloat(value).toLocaleString('ko-KR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }
};
</script>

<style scoped>
/* 스타일 수정 부분 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    background-color: #F9F7F7;
    padding: 20px;
    border-radius: 10px;
    max-width: 90%;
    width: 1000px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10000;
}

.modal-header {
    font-size: 24px;
    font-weight: bold;
    color: #112D4E;
    border-bottom: 2px solid #DBE2EF;
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.modal-body {
    margin-top: 20px;
    color: #3F72AF;
}

.investment-calculator {
    margin-bottom: 20px;
}

.calculator-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: #112D4E;
}

.styled-select {
    padding: 5px 10px;
    border: 1px solid #DBE2EF;
    border-radius: 5px;
    background-color: #F9F7F7;
    color: #112D4E;
}

.calculator-result {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.result-item h1 {
    color: #112D4E;
}

.comparison-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.comparison-table th,
.comparison-table td {
    border: 1px solid #DBE2EF;
    padding: 10px;
    text-align: center;
    color: #112D4E;
}

.comparison-table th {
    background-color: #DBE2EF;
}

.modal-footer {
    margin-top: 20px;
    text-align: right;
}

.close-btn {
    background-color: #3F72AF;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
}

.selected-savings-details {
    margin: 20px 0;
    background-color: #f1f3f5;
    text-align: left;
    padding: 10px;
    border-radius: 5px;
}
</style>
