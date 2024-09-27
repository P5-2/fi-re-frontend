<template>
    <div id="hotItem">
        <div v-if="toggle">
            <div class="itemWrapper savingsHover" @click="savingsItemClick">
                <p class="itemName">{{ pname }}</p>
                <div>
                    <span class="itemRate">최고 연 {{ maxRate }}%</span> <br>
                    <span class="itemRate2">최저 연 {{ minRate }}%</span>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="itemWrapper fundHover" @click="fundItemClick">
                <p class="itemName">{{ pname }}</p>
                <span class="itemRate">3개월 누적 이익<br> <span class="fs-3">{{ rate }}%</span></span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name : 'HotItem',
    data(){
        return {
        }
    },
    props : ['prdNo', 'pname', 'maxRate', 'minRate', 'toggle', 'rate'],
    methods : {
        savingsItemClick(){
            this.$router.push('/itemDetail/savings/'+this.prdNo)
            console.log(this.prdNo);
        },
        fundItemClick(){
            this.$router.push('/itemDetail/fund/'+this.prdNo)
            console.log(this.prdNo);
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
    .savingsHover:hover{
        background-color: #778DFF;
        color: white;
        width: 270px;
        height: 270px;
        text-align: center;
    }
    .fundHover:hover{
        background-color: #FA5454;
        color: white;
        width: 270px;
        height: 270px;
        text-align: center;
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