<template>
    <div class="fund-card" @click="fundItemClick(fund.prdNo)">
        <div class="fund-content">
            <!-- 펀드 제목 섹션 -->
            <h2 class="fund-title"><b>{{ fund.pname }}({{ fund.region }})</b></h2>

            <!-- 왼쪽 정보 섹션 -->
            <div class="fund-main-info">
                <div class="fund-details">
                    <p><b>유형:</b> {{ fund.type }}</p>
                    <p><b>기준가:</b> {{ fund.nav }}</p>
                </div>
            </div>

            <!-- 가운데 수익률 섹션 -->
            <div class="fund-rate-section">
                <p class="fund-rate-label">수익률(3개월 기준)</p>
                <div class="fund-rate">
                    <h1><b>{{ fund.rate }}%</b></h1>
                </div>
            </div>

            <!-- 위험도 섹션 -->
            <div class="grade-section">
                <div class="grade-icon" :style="{ backgroundColor: gradeColor }">{{ gradeIconText }}</div>
                <div class="grade-text" :style="{ color: gradeColor }">{{ gradeText }}</div>
            </div>

            <!-- 오른쪽 버튼 섹션 -->
            <div class="fund-actions">
                <div class="button-group">
                    <button @click.stop="compareProduct" class="action-btn compare-btn">상품 비교</button>
                    <button @click.stop="calcBtn" class="action-btn calc-btn">수익 계산</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { calculatorStore } from '@/stores/calculator';
import { mapActions } from 'pinia';

export default {
    props: {
        fund: {
            type: Object,
            required: true
        }
    },
    computed: {
        gradeIconText() {
            return this.fund.dngrGrade;
        },
        gradeText() {
            return this.getGradeText(this.fund.dngrGrade);
        },
        gradeColor() {
            return this.getGradeColor(this.fund.dngrGrade);
        }
    },
    methods: {
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
        fundItemClick(prdNo) {
            this.$router.push('/itemDetail/fund/' + prdNo);
        },
        compareProduct(event) {
            event.stopPropagation();
            console.log('상품비교:', this.fund.prdNo);
        },
        ...mapActions(calculatorStore, ['addFund']),
        calcBtn(event) {
            event.stopPropagation();
            this.fund.amount = 0;
            this.addFund(this.fund);
            alert('상품을 계산기에 추가했습니다');
        }
    }
};
</script>

<style scoped>

.fund-card {
display: flex;
justify-content: space-between;
align-items: center;
width: 65%;
padding: 20px;
margin: 20px auto; /* 가운데 정렬을 위해 auto 사용 */
border: 1px solid #ddd;
border-radius: 8px;
background-color: #fff;
cursor: pointer;
transition: box-shadow 0.3s ease;
}

.fund-card:hover {
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
/* 호버 시 그림자 효과 */
}

.fund-content {
flex-grow: 1;
display: flex;
gap: 20px;
}

.fund-title {
width: 100%;
font-size: 20px;
color: #333;
margin-bottom: 10px;
}

.fund-main-info {
flex: 1;
min-width: 150px;
}

.fund-details p {
margin: 5px 0;
}

.fund-rate-section {
flex: 1;
min-width: 150px;
text-align: center;
}

.fund-rate-label {
font-weight: bold;
margin-bottom: 5px;
}

.fund-rate {
font-size: 24px;
color: #0080ff;
}

.grade-section {
flex: 1;
min-width: 150px;
text-align: center;
display: flex;
flex-direction: column;
align-items: center;
}

.grade-icon {
width: 40px;
height: 40px;
border-radius: 50%;
font-weight: 600;
text-align: center;
line-height: 40px;
font-size: 18px;
color: white;
}

.grade-text {
font-weight: bold;
margin-top: 5px;
}

.fund-actions {
text-align: left;
}

.button-group {
display: flex;
flex-direction: column;
gap: 10px;
}

.action-btn {
width: 120px;
padding: 10px 15px;
border: none;
border-radius: 5px;
cursor: pointer;
font-weight: bold;
transition: background-color 0.3s ease;
}

.compare-btn {
background-color: #f0f0f0;
color: #333;
}

.compare-btn:hover {
background-color: #e0e0e0;
}

.calc-btn {
background-color: #0080ff;
color: white;
}

.calc-btn:hover {
background-color: #0066cc;
}

/* 각 위험 등급에 따른 색상 정의 */
:root {
--grade-color: #146138;
}

[style*="background-color: #146138"] {
--grade-color: #146138;
}

[style*="background-color: #1D9A58"] {
--grade-color: #1D9A58;
}

[style*="background-color: #FBBF0A"] {
--grade-color: #FBBF0A;
}

[style*="background-color: #F79E07"] {
--grade-color: #F79E07;
}

[style*="background-color: #EB5908"] {
--grade-color: #EB5908;
}

[style*="background-color: #DD1820"] {
--grade-color: #DD1820;
}
</style>
