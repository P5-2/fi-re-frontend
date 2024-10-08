<template>
    <CartItem :item="item" type="fund" :isSelected="isSelected" @update-selected-items="emitSelectedItems">
        <template #default>
            <div class="item-name">{{ item.pname }}</div>
            <div class="tag-container">
                <div class="tag type-tag">{{ item.type }}</div>
                <div class="tag nav-tag">기준가: <b>{{ item.nav }}</b>원</div>
            </div>
        </template>
        <template #extra>
            <div class="rate-section">
                <div class="rate-label">수익률(3개월)</div>
                <div class="rate-value">{{ item.rate }}%</div>
            </div>
            <div class="grade-section">
                <div class="grade-wrapper">
                    <div class="grade-icon" :style="{ backgroundColor: gradeColor }">{{ gradeIconText }}</div>
                    <div class="grade-text" :style="{ color: gradeColor }">{{ gradeText }}</div>
                </div>
            </div>
        </template>
    </CartItem>
</template>

<script>
import CartItem from './CartItem.vue';

export default {
    name: 'FundItem',
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
    computed: {
        gradeIconText() {
            return this.item.dngrGrade;
        },
        gradeText() {
            return this.getGradeText(this.item.dngrGrade);
        },
        gradeColor() {
            return this.getGradeColor(this.item.dngrGrade);
        },
    },
    methods: {
        emitSelectedItems(event) {
            this.$emit('update-selected-items', event);
        },
        getGradeText(grade) {
            switch (grade) {
                case 6: return '매우낮은위험';
                case 5: return '낮은위험';
                case 4: return '보통위험';
                case 3: return '다소높은위험';
                case 2: return '높은위험';
                case 1: return '매우높은위험';
                default: return '알 수 없음';
            }
        },
        getGradeColor(grade) {
            switch (grade) {
                case 6: return '#146138';
                case 5: return '#1D9A58';
                case 4: return '#FBBF0A';
                case 3: return '#F79E07';
                case 2: return '#EB5908';
                case 1: return '#DD1820';
                default: return '#666';
            }
        },
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
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9em;
    color: #555;
}

.nav-tag {
    background-color: #e0f7fa;
    color: #007bff;
}

.type-tag {
    background-color: #f0f0f0;
    color: #333;
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
</style>
