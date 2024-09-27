<template>
    <li class="cart-item">
        <div class="item-row">
            <div class="item-left">
                <!-- Bank Icon Images -->
                <div class="item-bank">
                    <img class="bank-logo" :src="getBankLogo(item.bname, type)" alt="Logo" />
                    <span v-if="type === 'saving'" class="bank-name">{{ item.bname }}</span>
                </div>

                <div class="item-info">
                    <div class="item-name">{{ item.pname }}</div>
                    <div class="item-benefit" v-if="type === 'saving'" >{{ item.description }}</div>
                    <div class="item-details">
                        <div class="tag-container">
                            <span class="tag type-tag">{{ item.type }}</span>
                            <span v-if="type === 'saving'" class="tag sub-period-tag">{{ item.subPeriod }}개월</span>
                            <span v-if="type === 'saving'" class="tag rate-tag">연 {{ item.minRate }}% ~ {{ item.maxRate }}%</span>
                            <span v-if="type === 'fund'" class="tag nav-tag">기준가 <b>{{ item.nav }}원</b></span>
                            <span v-if="type === 'fund'" class="tag rate-tag">수익률(3개월) <b>{{ item.rate }}%</b></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item-right">
                <div v-if="type === 'fund'" class="grade-section">
                    <div class="grade-wrapper">
                        <div class="grade-icon" :style="{ backgroundColor: gradeColor }">{{ gradeIconText }}</div>
                        <div class="grade-text" :style="{ color: gradeColor }">{{ gradeText }}</div>
                    </div>
                </div>
                <button @click="removeItem(item.prdNo)" class="remove-btn">삭제</button>
            </div>
        </div>
    </li>
</template>

<script>
export default {
    name: 'CartItem',
    props: {
        item: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: true
        }
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
        }
    },
    methods: {
        getBankLogo(bname, type) {
            if (type === 'fund') {
                return '@/assets/cart/fund.png'; // 펀드 타입의 경우 기본 펀드 이미지 사용
            }
            switch (bname) {
                case '국민은행': return '@/assets/cart/fund.png';
                case '신한은행': return '@/assets/cart/fund.png';
                case '우리은행': return '@/assets/cart/fund.png';
                case '하나은행': return '@/assets/cart/fund.png';
                default: return '@/assets/cart/fund.png';
            }
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
        removeItem(prdNo) {
            this.$emit('remove-item', prdNo);
        }
    }
}
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
    flex-direction: column; /* 로고와 은행 이름을 세로로 정렬 */
    align-items: center;
    gap: 5px; /* 로고와 은행 이름 사이의 간격 */
}

.bank-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%; /* 로고를 원형으로 */
}

.bank-name {
    font-weight: bold;
    font-size: 1em;
    color: #333; /* 진한 색상으로 가독성 향상 */
    text-align: center; /* 텍스트를 가운데 정렬 */
}

.item-info {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    margin-left: 15px; /* 로고와 정보 사이에 간격 추가 */
}

.item-name {
    font-weight: bold;
    font-size: 1.2em;
    color: #333;
    text-align: left;
    line-height: 1.2;
    margin-bottom: 5px;
}

.item-benefit {
    font-size: 0.9em; /* 글씨 크기 줄이기 */
    color: #777; /* 글자 색을 회색으로 */
    margin-bottom: 5px; /* 아래 요소들과 간격 추가 */
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

.type-tag {
    background-color: #ffebee;
    color: #c62828;
}

.sub-period-tag {
    background-color: #e3f2fd;
    color: #1976d2;
}

.nav-tag {
    background-color: #e0f7fa;
    color: #007bff;
}

.rate-tag {
    background-color: #fff8e1;
    color: #ffa000;
}

.item-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.grade-section {
    display: flex;
    justify-content: center;
}

.grade-wrapper {
    display: flex;
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

.remove-btn {
    background-color: #ff4d4d;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: bold;
    border: none;
}

.remove-btn:hover {
    background-color: #ff0000;
}
</style>
