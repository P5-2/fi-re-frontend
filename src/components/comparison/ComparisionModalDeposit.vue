<template>
    <div v-if="isComparisonModalVisible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h3>예금 상품 비교 - 1년 기준 수익률</h3>
            </div>

            <div class="modal-body">
                <!-- 투자 금액 입력 -->
                <div class="investment-input">
                    <label for="investmentAmount">투자 금액:</label>
                    <input type="number" v-model="investmentAmount" id="investmentAmount" placeholder="투자 금액을 입력하세요" />
                    만원
                </div>

                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>상품명</th>
                            <th>기본 금리</th>
                            <th>최고 금리</th>
                            <th>예상 수익 (기본 금리)</th>
                            <th>예상 수익 (최고 금리)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- 상품 별로 기간이 12개월인 옵션만 필터링 -->
                        <tr v-for="deposit in filteredDeposits" :key="deposit.savingsDeposit.fin_prdt_cd">
                            <td>{{ deposit.savingsDeposit.fin_prdt_nm }} ({{ deposit.options[0].intr_rate_type_nm }})</td>
                            <td>{{ deposit.options[0].intr_rate }}%</td>
                            <td>{{ deposit.options[0].intr_rate2 }}%</td>
                            <!-- 1년 기준 기본 금리로 수익 계산 -->
                            <td>{{ calculateEarnings(deposit.options[0].intr_rate) }}원</td>
                            <!-- 1년 기준 최고 금리로 수익 계산 -->
                            <td class="max_earning">{{ calculateEarnings(deposit.options[0].intr_rate2) }}원</td>
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
        selectedDeposits: {
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
            investmentAmount: 100, // 기본 투자 금액 설정 (단위: 만원)
        };
    },
    watch: {
        isComparisonModalVisible(newVal) {
            if (newVal) {
                // 모달이 열릴 때 selectedDeposits 데이터 확인
                console.log("selectedDeposits 데이터:", this.selectedDeposits);
            }
        }
    }
    ,
    computed: {
        filteredDeposits() {
            // selectedDeposits에서 save_trm이 "12"인 옵션만 필터링
            return this.selectedDeposits
                .map(deposit => {
                    // options 중 save_trm이 12인 항목만 필터링
                    const filteredOptions = deposit.options.filter(option => option.save_trm === "12");
                    // 해당 옵션이 있는 경우에만 반환
                    if (filteredOptions.length > 0) {
                        return {
                            savingsDeposit: deposit.savingsDeposit,
                            options: filteredOptions
                        };
                    }
                    return null;
                })
                .filter(deposit => deposit !== null); // null인 항목은 제거
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        calculateEarnings(interestRate) {
            const investmentInWon = this.investmentAmount * 10000; // 만원 단위를 원으로 변환
            // 입력된 이율을 바탕으로 수익 계산 (1년 기준)
            const rate = parseFloat(interestRate) / 100;
            const earnings = investmentInWon * (rate + 1);
            return earnings.toLocaleString(); // 천 단위 콤마 포함하여 반환
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
    width: 800px;
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

.investment-input {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
}

.investment-input label {
    margin-right: 10px;
    font-weight: bold;
}

.investment-input input {
    padding: 5px;
    width: 200px;
    border: 1px solid #DBE2EF;
    border-radius: 5px;
}

.modal-body {
    margin-top: 20px;
    color: #3F72AF;
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

.max_earning {
    color: rgb(255, 0, 0) !important;
    font-weight: bold;
}

.close-btn {
    background-color: #3F72AF;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
}
</style>