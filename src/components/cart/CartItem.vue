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
                    <img class="bank-logo" :src="getBankLogo(item.bname, type)" alt="Logo" />
                    <span v-if="type === 'saving'" class="bank-name">{{ item.bname }}</span>
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
            this.$emit('update-selected-items', {
                prdNo: this.item.prdNo,
                isSelected: event.target.checked,
            });
        },
        getBankLogo(bname, type) {
            // type에 따라 다른 이미지를 반환
            if (type === 'fund') {
                switch (this.item.type) {
                    case 'MMF':
                        return '/src/assets/fund/mmf.png';
                    case '주식형':
                        return '/src/assets/fund/주식형.png';
                    case '채권형':
                        return '/src/assets/fund/채권형.png';
                    default:
                        return '/src/assets/cart/fund.png'; // 기본 펀드 이미지
                }
            }
            switch (bname) {
                case '국민은행':
                    return '/src/assets/bank/국민은행.png';
                case '신한은행':
                    return '/src/assets/bank/신한은행.png';
                case '우리은행':
                    return '/src/assets/bank/우리은행.png';
                case '하나은행':
                    return '/src/assets/bank/하나은행.png';
                default:
                    return '/src/assets/cart/default.png'; // 기본 은행 이미지
            }
        },
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

.item-name {
    font-weight: bold;
    font-size: 1.2em;
    color: #333;
    text-align: left;
    line-height: 1.2;
    margin-bottom: 5px;
}

.item-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: #555;
    margin-top: 4px;
}

.tag-container {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.tag {
    background-color: #f0f0f0;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9em;
    color: #555;
}

.nav-tag {
    background-color: #e0f7fa;
    color: #007bff;
}

.item-right {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-direction: column;
    justify-content: flex-start;
    text-align: right;
}

.rate-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 3cm;
}

.rate-label {
    font-size: 0.9em;
    color: #666;
}

.rate-value {
    font-size: 2em;
    color: #007bff;
    font-weight: bold;
}

.grade-section {
    display: flex;
    justify-content: center;
}

.grade-wrapper {
    display: flex;
    width: 100px;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
}

.grade-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.grade-text {
    font-size: 0.9em;
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