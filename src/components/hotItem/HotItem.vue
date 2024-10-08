<template>
    <div id="hotItem">
        <div v-if="financeType === '적금'">
            <div class="itemWrapper SHover" @click="savingsItemClick">
                <p class="itemName" id="itemName">{{ financeItem.savingsDeposit.fin_prdt_nm }}</p>
                <div>
                    <div class="itemRate">최고 연 {{ financeItem.options[0].intr_rate2 }}%</div>
                    <div class="itemRate2">최저 연 {{ financeItem.options[0].intr_rate }}%</div>
                </div>
            </div>
        </div>
        <div v-else-if="financeType === '예금'">
            <div class="itemWrapper DHover" @click="savingsItemClick">
                <p class="itemName" id="itemName">{{ financeItem.savingsDeposit.fin_prdt_nm }}</p>
                <div>
                    <div class="itemRate">최고 연 {{ financeItem.options[0].intr_rate2 }}%</div>
                    <div class="itemRate2">최저 연 {{ financeItem.options[0].intr_rate }}%</div>
                </div>
            </div>
        </div>
        <div v-else-if="financeType === '펀드'">
            <div class="itemWrapper fundHover" @click="fundItemClick">
                <p class="itemName">{{ financeItem.pname }}</p>
                <span class="itemRate">3개월 누적 이익<br> <span class="fs-3">{{ financeItem.rate }}%</span></span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name : 'HotItem',
    props : ['financeItem', 'financeType'], //financeItem : 예적금 상품, financeType : 상품타입(예금, 적금, 펀드)
    methods : {
        savingsItemClick(){
            this.$router.push(`/itemDetail/savings/${this.financeItem.savingsDeposit.fin_prdt_cd}/${this.financeItem.options[0].intr_rate_type_nm}/${this.financeItem.options[0].rsrv_type}`);
        },
        fundItemClick(){
            this.$router.push('/itemDetail/fund/'+this.financeItem.prdNo);
        }
    },
    created(){
        // console.log(this.financeItem);
        // console.log(this.financeType);
    },
    updated(){
        console.log(this.financeItem);
        console.log(this.financeType);
        let $itemName = document.getElementById("itemName");
        let $rateWrapper = document.getElementById("rateWrapper");
        if(this.financeType === "예금" || this.financeType === "적금"){
            if($itemName !== null){
                $itemName.textContent = this.financeItem.fin_prdt_nm;
            }
        } else if(this.financeType === "펀드"){
            if($itemName !== null){
                $itemName.textContent = this.financeItem.pname;
            }
        }
    }
}
</script>
<style scoped>
    .itemWrapper{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 250px;
        height: 250px;
        background-color: white;
        text-align: center;
        padding : 30px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
    }
    .itemWrapper:hover{
        color: white;
        width: 270px;
        height: 270px;
        text-align: center;
    }
    .SHover:hover{
        background-color: #3FAF4F;
    }
    .DHover:hover{
        background-color: #3F72AF;
    }
    .fundHover:hover{
        background-color: #AF3F4F;
    }
    .itemName{
        font-size : 20px;
        height: 70px;
    }
    .itemRate{
        font-size : 24px;
    }
    .itemRate2{
        font-size : 22px;
    }
    .fundTitle{
        background-color: #FA5454;
    }
    #hotItem{
        width: min-content;
        box-shadow: 5px 5px 5px gray
    }
</style>