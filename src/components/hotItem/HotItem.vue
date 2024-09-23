<template>
    <div id="hotItem">
        <div v-if="toggle">
            <div class="itemTitleWrapper">
                <div class="itemTitleLeft"></div>
                <div class="itemTitle">
                    예적금 Hot
                </div>
                <div class="itemTitleRight"></div>
            </div>
            <div class="itemWrapper" @click="savingsItemClick">
                <p class="itemName fs-4">{{ pname }}</p>
                <p class="itemRate fs-3">연 {{ minRate }}%</p>
            </div>
        </div>
        <div v-else>
            <div class="itemTitleWrapper">
                <div class="fundTitleLeft"></div>
                <div class="itemTitle fundTitle">
                    펀드 Hot
                </div>
                <div class="fundTitleRight"></div>
            </div>
            <div class="itemWrapper" @click="fundItemClick">
                <p class="itemName fs-4">{{ pname }}</p>
                <p class="itemRate fs-5">3개월 누적 이익<br> <span class="fs-3">{{ rate }}%</span></p>
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
    props : ['prdNo', 'pname', 'minRate', 'toggle', 'rate'],
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
    .itemTitleWrapper{
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(0, 50%);
        z-index: 0;
    }
    .itemTitleRight{
        border-bottom: 19px solid transparent;
        border-top: 19px solid transparent;
        border-left: 19px solid #778DFF;
        border-right: 19px solid transparent;
    }
    .itemTitleLeft{
        border-bottom: 19px solid transparent;
        border-top: 19px solid transparent;
        border-left: 19px solid transparent;
        border-right: 19px solid #778DFF;
    }
    .fundTitleLeft{
        border-bottom: 19px solid transparent;
        border-top: 19px solid transparent;
        border-left: 19px solid transparent;
        border-right: 19px solid #FA5454;
    }
    .fundTitleRight{
        border-bottom: 19px solid transparent;
        border-top: 19px solid transparent;
        border-left: 19px solid #FA5454;
        border-right: 19px solid transparent;
    }
    .itemTitle{
        display: inline-block;
        background-color: #778DFF;
        color: whitesmoke;
        width: 120px;
        font-size: 20px;
        text-align: center;
        padding: 4px;
    }

    .itemWrapper{
        width: 300px;
        height: 300px;
        background-color: white;
        border-radius: 20px;
        text-align: center;
        padding : 30px;
        font-weight: bold;
        cursor: pointer;
    }
    .itemWrapper:hover{
        background-color: #e2e2e2;
    }
    .itemName{
        width: 240px;
        height: 80px;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .fundTitle{
        background-color: #FA5454;
    }
</style>