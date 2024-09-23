<template lang="">
    <div id="detailWrapper">
        <div id="title">
            {{savings.pname}}
            <hr>
        </div>
        <div id="contentWrapper">
            <div class="myRow">
                <img class="logo" v-if="savings.bname === '국민은행'" src="@/assets/bank/국민은행.png" width="60" height="60">
                <img class="logo" v-if="savings.bname === '신한은행'" src="@/assets/bank/신한은행.png" width="60" height="60">
                <img class="logo" v-if="savings.bname === '우리은행'" src="@/assets/bank/우리은행.png" width="60" height="60">
                <img class="logo" v-if="savings.bname === '하나은행'" src="@/assets/bank/하나은행.png" width="60" height="60">
                <span class="content1">
                    {{savings.bname}} <b>{{savings.type}}</b>
                </span>
            </div>
            <div class="description">
                {{savings.description}}
            </div>
            <table id="rateTable">
                <tbody>
                    <tr>
                        <th>가입대상</th>
                        <td>{{savings.target}}</td>
                    </tr>
                    <tr>
                        <th>금액</th>
                        <td>{{savings.subAmount}}</td>
                    </tr>
                    <tr>
                        <th>기간</th>
                        <td>{{savings.subPeriod}}개월</td>
                    </tr>
                    <tr>
                        <th>이율</th>
                        <td><b>연 {{savings.minRate}}%</b> ~ <b>{{savings.maxRate}}%</b></td>
                    </tr>
                    <tr>
                        <th>우대조건</th>
                        <td>{{savings.benefit}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="buttons">
            <button class="btn btn-secondary fs-5 left-btn">상품비교</button>
            <button class="btn btn-success fs-5" @click="calcBtn">수익계산</button>
        </div>
    </div>
</template>
<script>
import { calculatorStore } from '@/stores/calculator';
import axios from 'axios';
import { mapActions } from 'pinia';

export default {
    name : 'SavingsItemDetail',
    data(){
        return{
            savings : {},
            prdNo : 0,
        }
    },
    created(){
        this.prdNo = this.$route.params.prdNo;
        axios.get("http://localhost:9000/finance/savings/get", {params : {prdNo : this.prdNo}})
        .then((res)=>{
            this.savings = res.data;
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    methods : {
        ...mapActions(calculatorStore, ['addSavings']),
        calcBtn : function(){
            this.savings.amount = 0;
            this.addSavings(this.savings);
            alert("상품을 계산기에 추가했습니다");
        }
    }
}
</script>

<style scoped>
    #detailWrapper{
        background-color: #DFFDFF;
        border-radius: 20px;
        width : 1300px;
        margin : auto;
        height: 700px;
        padding: 30px;
    }
    #title{
        width: 80%;
        margin : auto;
        text-align: center;
        font-size: 42px;
        font-weight: bold;
    }
    #contentWrapper{
        width: 80%;
        padding: 30px;
        margin: auto;
    }
    #buttons{
        width: 80%;
        margin: auto;
        text-align: center;
    }
    .left-btn{
        margin-right: 60px;
    }
    .myRow{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }
    .logo{
        border-radius: 100%;
    }
    .content1{
        margin-left: 26px;
        font-size: 28px;
    }
    .description{
        padding: 0px 30px 0px 30px;
        margin-bottom: 20px;
        font-size: 18px;
    }
    #rateTable{
        width: 100%;
        font-size: 22px;
        border-collapse: separate;
        border-spacing: 10px 10px;
        background-color: #EFFFFF;
        border-radius: 20px;
    }
    th{
        border-right: 2px solid black;
        width: 200px;
    }
</style>