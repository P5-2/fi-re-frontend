<template>
    <!-- 모달 창이 열려 있으면 표시 -->
    <div v-if="isComparisonModalVisible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>상품 비교 및 수익 계산</h3>
            </div>

            <div class="modal-body">
                <!-- 투자 수익 계산 UI -->
                <div class="investment-calculator">
                    <div class="calculator-header">
                        <span>이 상품에</span>
                        <select v-model="selectedFundId" class="styled-select">
                            <option v-for="fund in selectedFunds" :key="fund.prdNo" :value="fund.prdNo">
                                {{ fund.pname }}
                            </option>
                        </select>
                        <span>기간</span>
                        <select v-model="investmentPeriod" class="styled-select">
                            <option value="3">3개월</option>
                            <option value="6">6개월</option>
                            <option value="12">1년</option>
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
                            <span>평가액</span>
                            <h1>{{ formatNumber(valuation) }}원</h1>
                        </div>
                        <div class="result-item">
                            <span>수익률(적립식)</span>
                            <h1>{{ selectedReturnRate }}%</h1>
                        </div>
                    </div>
                </div>

                <!-- 비교 테이블 -->
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th rowspan="2">상품명</th>
                            <th rowspan="2">기준가</th>
                            <th rowspan="2">설정일</th>
                            <th colspan="3">수익률(%)</th>
                        </tr>
                        <tr>
                            <th>3개월</th>
                            <th>6개월</th>
                            <th>1년</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="fund in selectedFunds" :key="fund.prdNo">
                            <td>{{ fund.pname }}</td>
                            <td>{{ formatNumber(fund.nav) }}</td>
                            <td>{{ fund.bseDt }}</td>
                            <td class="modal-rate">{{ fund.rate }}%</td> <!-- 3개월 수익률 -->
                            <td class="modal-rate">{{ fund.sixMRate }}%</td> <!-- 6개월 수익률 -->
                            <td class="modal-rate">{{ fund.oneYRate }}%</td> <!-- 1년 수익률 -->
                        </tr>
                    </tbody>
                </table>
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
        selectedFunds: {
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
            selectedFundId: null, // 선택된 펀드의 prdNo
            selectedFund: null, // 선택된 펀드 객체
            investmentPeriod: 0, // 투자 기간 (3개월, 6개월, 1년)
            monthlyInvestment: 0, // 매월 투자 금액 (10만원, 30만원, 50만원)
            selectedReturnRate: 0 // 선택된 펀드에 따른 수익률
        };
    },
    watch: {
        // selectedFundId가 변경될 때마다 해당 펀드를 찾아 selectedFund에 할당
        selectedFundId(newFundId) {
            this.selectedFund = this.selectedFunds.find(fund => fund.prdNo === newFundId);
            this.updateReturnRate();
        },
        // investmentPeriod가 변경될 때마다 수익률을 업데이트
        investmentPeriod() {
            this.updateReturnRate();
        }
    },
    computed: {
        totalInvestment() {
            // 총 투자금액 = 매월 투자금액 * 투자 기간 (월 기준)
            return this.monthlyInvestment * this.investmentPeriod;
        },
        valuation() {
            // 평가액 = 총 투자금액 * (1 + 수익률)
            const returnRate = this.selectedReturnRate / 100;
            return (this.totalInvestment * (1 + returnRate)).toFixed(2);
        }
    },
    methods: {
        updateReturnRate() {
            if (!this.selectedFund) {
                this.selectedReturnRate = 0;
                return;
            }
            if (this.investmentPeriod == 3) {
                this.selectedReturnRate = this.selectedFund.rate || 0;
            } else if (this.investmentPeriod == 6) {
                this.selectedReturnRate = this.selectedFund.sixMRate || 0;
            } else if (this.investmentPeriod == 12) {
                this.selectedReturnRate = this.selectedFund.oneYRate || 0;
            }
        },
        closeModal() {
            this.$emit('close'); // 부모 컴포넌트에 모달 닫기 이벤트 전달
        },
        formatNumber(value) {
            // 천 단위 쉼표 및 소수점 두 자리 유지
            return parseFloat(value).toLocaleString('ko-KR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    }
};
</script>


<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 15px;
    width: 80%;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
    display: flex;
    justify-content: center;
    padding-bottom: 15px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
}

.investment-calculator {
    background-color: #e6eef8;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.calculator-header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 18px;
}

.styled-select {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    transition: all 0.2s ease-in-out;
}

.styled-select:hover {
    border-color: #007bff;
}

.calculator-result {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.result-item h1 {
    font-size: 36px;
    color: #333;
}

.result-item span {
    display: block;
    font-size: 18px;
    color: #666;
}

.comparison-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.comparison-table th,
.comparison-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
}

.comparison-table th {
    background-color: #f8f9fa;
    font-weight: bold;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.close-btn {
    background-color: #ff4d4f;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.close-btn:hover {
    background-color: #ff7875;
}

/* 수익률 텍스트 스타일 */
.modal-rate {
    color: red;
    font-weight: bold;
}
</style>
