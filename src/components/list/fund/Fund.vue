<template>
    <div class="fund-item">
        <table class="fund-table">
            <tr>
                <td colspan="3" class="fund-name" @click.native="fundItemClick(fund.prdNo)">{{ fund.pname }} ({{ fund.region }})</td>
                <td rowspan="2" class="button-section">
                    <button class="btn btn-secondary">상품비교</button>
                    <button class="btn btn-success"  @click="calcBtn">수익계산</button>
                </td>
                
            </tr>
            <tr>
                <td><b>유형 :</b> {{ fund.type }}</td>
                <td><b>기준가 :</b> {{ fund.nav }}</td>
            </tr>
            <tr>
                <td colspan="2" class="label">수익률(3개월 기준)</td>
                
            </tr>
            <tr>
                <td class="value"><h1><b>{{ fund.rate }}%</b></h1></td> <td></td><td></td>
                <td rowspan="2" class="grade-section">
                    <div id="gradeIcon" :style="{ backgroundColor: gradeColor }">{{ gradeIconText }}</div>
                    <div id="gradeText" :style="{ color: gradeColor }">{{ gradeText }}</div>
                </td>
                
            </tr>
        </table>
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
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(date).toLocaleDateString('ko-KR', options);
        },
        getGradeText(grade) {
            switch(grade) {
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
            switch(grade) {
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
            console.log(prdNo);
        },
        ...mapActions(calculatorStore, ['addFund']),
        calcBtn : function(){
            this.fund.amount = 0;
            this.addFund(this.fund);
            alert("상품을 계산기에 추가했습니다");
        }
    }
};
</script>

<style scoped>
.fund-item {
    border: 1px solid #ddd;
    padding: 20px;
    margin: 10px auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    max-width: 600px;
}

.fund-table {
    width: 100%;
    font-size: 1rem;
    table-layout: fixed; /* 테이블의 고정 레이아웃 */
}

.fund-table td {
    padding: 8px; /* 셀 간의 간격을 적절히 조정 */
    vertical-align: middle;
}

.label {
    text-align: left;
    font-weight: bold;
}

.value {
    text-align: center;
}

.fund-name {
    font-weight: bold;
    font-size: 1.2rem;
    text-align: left;
    padding-bottom: 10px;
    cursor: pointer;
    transition: text-decoration 0.3s; /* 밑줄 전환 애니메이션 */
}

.fund-name:hover {
    text-decoration: underline; /* 마우스 오버 시 밑줄 표시 */
}

.grade-section {
    text-align: center;
    vertical-align: middle;
    width: 80px;
}

#gradeIcon {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    font-weight: 600;
    text-align: center;
    line-height: 50px;
    font-size: 24px;
    color: white;
    margin: 0 auto;
}

.button-section .btn {
    text-align: right;
    display: block;
    margin: 5px 0;
    width: 75%;
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

#buttons {
    width: 80%;
    margin: auto;
    margin-top: 10px;
    text-align: center;
}

.left-btn {
    margin-right: 60px;
}
</style>
