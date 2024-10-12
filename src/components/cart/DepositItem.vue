<template>
    <CartItem :item="item" type="deposit" :isSelected="isSelected" @update-selected-items="emitSelectedItems">
        <template #default>
            <div class="item-name">{{ item.savingsDeposit.fin_prdt_nm }}</div>
            <div class="tag-container">
                <div class="tag type-tag">{{ item.savingsDeposit.join_way }}</div>
                <div class="tag limit-tag" v-if="item.savingsDeposit.max_limit">최대한도: <b>{{ item.savingsDeposit.max_limit }}</b>원</div>
                <div class="tag limit-tag" v-else>최대한도: 제한 없음</div>
            </div>
        </template>
        <template #extra>
            <div class="rate-section" v-for="(option, index) in item.options.slice(0, 4)" :key="index">
                <div class="rate-label">{{ option.save_trm }}개월 금리</div>
                <div class="rate-value">{{ option.intr_rate2 }}%</div>
            </div>
        </template>
    </CartItem>
</template>

<script>
import CartItem from './CartItem.vue';

export default {
    name: 'SavingsItem',
    components: { CartItem },
    props: {
        item: {
            type: Object,
            required: true,
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        emitSelectedItems(isSelected) {
            this.$emit('update-selected-items', {
                prdNo: this.item.savingsDeposit.fin_prdt_cd,
                intr_rate_type_nm: this.item.options[0].intr_rate_type_nm,
                isSelected: isSelected
            });
        }
    },
};
</script>

<style scoped>
.item-name {
    font-weight: bold;
    font-size: 1.2em;
    color: #333;
    text-align: left;
    line-height: 1.2;
    margin-bottom: 5px;
}

.tag-container {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.tag {
    background-color: #f0f0f0;
    padding: 6px 15px; /* 패딩을 늘려 태그를 더 돋보이게 함 */
    border-radius: 20px; /* 태그의 모서리를 더 둥글게 */
    font-size: 0.9em;
    color: #555;
    text-align: center;
    font-weight: bold; /* 태그 텍스트 굵기 조절 */
}

.type-tag {
    background-color: #dbeafe; /* 더 부드러운 파랑색 배경 */
    color: #2563eb; /* 파랑색 텍스트 */
}

.limit-tag {
    background-color: #fef3c7; /* 밝은 노란색 배경 */
    color: #92400e; /* 진한 갈색 텍스트 */
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
    font-size: 1.6em;
    color: #007bff;
    font-weight: bold;
}
</style>
