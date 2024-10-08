<template>
    <li class="cart-item">
        <div class="item-row">
            <div class="item-left">
                <label class="custom-checkbox">
                    <input type="checkbox" :checked="isSelected" @change="emitSelectedItems" />
                    <span class="checkmark"></span>
                </label>

                <!-- Bank Icon Images -->
                <div class="item-bank">
                    <img class="bank-logo" :src="getBankLogo(item, type)" alt="Logo" />
                    <span v-if="(type === 'saving' || type === 'deposit') && getBankName(item, type).length > 4"
                        class="bank-name">
                        {{ getBankName(item, type).slice(0, 4) }}<br>{{ getBankName(item, type).slice(4) }}
                    </span>
                    <span v-else class="bank-name">
                        {{ getBankName(item, type) }}
                    </span>
                </div>

                <div class="item-info">
                    <!-- 슬롯을 통해 삽입된 콘텐츠 -->
                    <slot></slot>
                    <div class="item-details">
                        <div class="tag-container">
                            <slot name="tags"></slot> <!-- 태그용 슬롯 -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- 추가 슬롯: 위험도, 수익률 등의 항목을 삽입 -->
            <slot name="extra"></slot>
        </div>
    </li>
</template>

<script>
export default {
    name: 'CartItem',
    props: {
        item: {
            type: Object,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        emitSelectedItems(event) {
            // prdNo를 한 줄로 간결하게 처리
            const prdNo = this.item.prdNo || this.item.fin_prdt_cd;

            if (prdNo) {
                // prdNo와 선택 상태를 emit
                this.$emit('update-selected-items', {
                    prdNo: prdNo,
                    isSelected: event.target.checked,
                });
            } else {
                console.error("prdNo를 찾을 수 없습니다.");
            }
        },
        getBankLogo(item, type) {
            if (type === 'fund') {
                switch (item.type) {
                    case 'MMF':
                        return '/src/assets/fund/mmf.png';
                    case '주식형':
                        return '/src/assets/fund/주식형.png';
                    case '채권형':
                        return '/src/assets/fund/채권형.png';
                    default:
                        return '/src/assets/cart/fund.png'; // 기본 펀드 이미지
                }
            } else if (type === 'saving' || type === 'deposit') {
                const bankName = item.savingsDeposit ? item.savingsDeposit.kor_co_nm : item.kor_co_nm;
                return `/src/assets/bank/${bankName}.png`; // 은행 이미지 반환
            }
        },
        getBankName(item, type) {
            // 적금 또는 예금의 경우, savingsDeposit에서 은행명을 가져옴
            if (type === 'saving' || type === 'deposit') {
                return item.savingsDeposit ? item.savingsDeposit.kor_co_nm : item.kor_co_nm;
            }
            return ''; // 기본값 반환
        }
    },
};
</script>

<style scoped>
.cart-item {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    border: 1px solid #DBE2EF; /* 연한 회색 테두리 추가 */
}

.cart-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.item-left {
    display: flex;
    align-items: center;
    flex-grow: 1;
}

.item-bank {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.bank-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.bank-name {
    font-weight: bold;
    font-size: 1em;
    color: #524d4da4;
    text-align: center;
}

.item-info {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    margin-left: 15px;
}

.item-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: #555;
    margin-top: 4px;
}

/* Custom Checkbox */
.custom-checkbox {
    display: inline-block;
    position: relative;
    padding-left: 30px;
    cursor: pointer;
    user-select: none;
    font-size: 16px;
}

.custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.custom-checkbox input:checked~.checkmark {
    background-color: #007bff;
}

.custom-checkbox .checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.custom-checkbox input:checked~.checkmark:after {
    display: block;
}

.custom-checkbox .checkmark:after {
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}
</style>