<template lang="">
    <div id="calculator-wrapper">
        <div id="calculator-btn" @click="btnClick">
            계산기 ↑
        </div>
        <div id="calculator">
            <div class="cal-wrapper"> <!--월 저금액 -->
                <h3>계산기</h3>
                <h6 class="mb-2">미래 자산을 계산해보세요</h6>
                <label>월 저금액</label>
                <input type="text" class="form-control" v-model="temp_monthlySave" @input="setMonthlySaveHandler()">
            </div>
            <div class="cal-wrapper"> <!-- 예적금 상품 -->
                <h3>예적금</h3>
                <ol v-for="(savings, index) in savingslist" :key="savings.prdNo">
                    <li class="savingWrapper">
                        <button type="button" class="x-btn btn-close" aria-label="Close" @click="removeSavings(savings.prdNo, index)"></button>
                        <b class="b-pname">{{savings.pname}}</b> <br> <hr>
                        이율 : <b>{{savings.minRate}}</b><br>
                        금액 : <b>{{savings.subAmount}}</b> <br>
                        기간 : <b>{{savings.subPeriod}}개월</b> <br>
                        투자금액 : <input type="text" v-model="temp_savingsAmounts[index]" @input="setSavingsAmountHandler(savings.prdNo, temp_savingsAmounts[index])">
                    </li>
                </ol>
            </div>
            <div class="cal-wrapper"> <!-- 펀드 상품 -->
                <h3>펀드</h3>
                <ol v-for="(fund, index) in fundlist" :key="fund.prdNo">
                    <li class="savingWrapper">
                        <button type="button" class="x-btn btn-close" aria-label="Close" @click="removeFund(fund.prdNo, index)"></button>
                        <b class="b-pname">{{fund.pname}}</b> <br> <hr>
                        누적이율 : <b>{{fund.rate}}</b> <br>
                        투자금액 : <input type="text" v-model="temp_fundAmounts[index]" @input="setFundAmountHandler(fund.prdNo, temp_fundAmounts[index])">
                    </li>
                </ol>
            </div>
            <div class="cal-wrapper"> <!-- 금 투자 -->
                <h3>금</h3>
                <label style="float : left">금 투자금액</label>
                <input type="text" class="form-control" v-model="temp_gold" @input="setGoldHandler()">
            </div>
            <div class="cal-wrapper"> <!-- 개월 수 및 계산 버튼 및 결과 -->
                <div class="mb-3">
                    <label class="fs-5">투자 개월 수 :</label>
                    <input type="text" class="month-input" v-model="temp_month" @input="setMonthHandler()">
                </div>
                <button class="btn btn-light" @click="cal_click">계산하기</button> <br>
                <div class="mt-3 fs-4">
                    <span>결과 : <b id="result">0원</b></span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { calculatorStore } from '@/stores/calculator.js';
import { mapState, mapActions } from 'pinia';

export default {
    name : "Calculator",
    data(){
        return {
            clicked : false,
            options : {
                duration : 500,
            },
            temp_month : 0,
            temp_gold : 0,
            temp_monthlySave : 0,
            temp_savingsAmounts : [],
            temp_fundAmounts : [],
        }
    },
    computed : {
                ...mapState(calculatorStore, ['monthly_save', 'savingslist', 'fundlist', 'gold', 'goldRate', 'month']),
    },
    created(){
        this.temp_month = this.month;
        this.temp_gold = this.gold;
        this.temp_monthlySave = this.monthly_save;
        this.temp_savingsAmounts = this.savingslist.map((savings)=>{return savings.amount})
        this.temp_fundAmounts = this.fundlist.map((fund)=>{return fund.amount});
    },
    methods:{
        btnClick : function(){
            let wrapper = document.getElementById("calculator-wrapper");
            let btn = document.getElementById("calculator-btn");
            let keyframes;
            if(this.clicked){//계산기가 올라와 있으므로 내려야함
                this.clicked = false;
                keyframes = {
                    transform : ["translate(-50%, 180px)"]
                };
                wrapper.animate(keyframes, this.options);
                setTimeout(function(){
                    wrapper.style.transform = 'translate(-50%, 180px)';
                }, 450);
                btn.textContent= "계산기 ↑";
            }else{//계산기가 내려와 있으므로 올려야함
                this.clicked = true;
                keyframes = {
                    transform : ["translate(-50%, 0)"]
                };
                wrapper.animate(keyframes, this.options);
                setTimeout(function(){
                    wrapper.style.transform = 'translate(-50%, 0)';
                }, 450);
                btn.textContent= "계산기 ↓";
            }
            
        },
        ...mapActions(calculatorStore, ['calculate', 'setMonth', 'setGold', 'setMonthlySave', 'setFundAmount', 'setSavingsAmount', 'removeSavings', 'removeFund']),
        cal_click : function(){
            let result = this.calculate();
            console.log(result);
            result += "원";
            document.getElementById("result").textContent = result;
        },
        setMonthHandler : function(){
            this.setMonth(this.temp_month);
        },
        setGoldHandler : function(){
            this.setGold(this.temp_gold);
        },
        setMonthlySaveHandler : function(){
            this.setMonthlySave(this.temp_monthlySave);
        },
        setFundAmountHandler : function(prdNo, amount){
            this.setFundAmount(prdNo, amount);
        },
        setSavingsAmountHandler : function(prdNo, amount){
            this.setSavingsAmount(prdNo, amount);
        }
    }
}
</script>
<style scoped>
    #calculator-wrapper{
        position : fixed;
        left:50%;
        transform: translate(-50%, 180px);
        bottom: 0px;
    }
    #calculator-btn{
        cursor: pointer;
        margin-left: 1200px;
        width: 100px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: white;
        background-color: #4b5664;
    }
    #calculator{
        border-radius: 20px;
        background-color: #4b5664;
        margin : auto;
        width: 1600px;
        height: 200px;
        overflow: auto;
        padding: 10px;
        display: flex;
        justify-content: space-evenly;
    }
    .cal-wrapper{
        width : 280px;
        padding : 10px;
        margin : 10px;
        color : whitesmoke;
    }
    .cal-wrapper:not(:first-child){
        text-align: center;
    }
    ol, li{
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .savingWrapper{
        border : 2px solid black;
        background-color : #fefefe;
        border-radius: 10px;
        /*#f9ba21*/
        color : black;
        padding : 10px;
        margin-bottom : 5px;
    }
    .savingWrapper input{
        border-radius: 5px;
        padding: 3px;
        border-width: 1px;
        width: 120px;
        font-size: 14px;
    }
    .x-btn{
        float : right;
    }
    .b-pname{
        float : left;
    }
    .month-input{
        margin-left: 5px;
        width: 80px;
        border-radius: 5px;
        padding: 3px;
        text-align: center;
    }
</style>