<template>
    <div id="HotItemList">
        <div id="HotItemTitle"><img src="@/assets/hotItem/fire.png" width="45" height="45"><span id="title">예적금 Hot 상품</span></div>
        <div id="HotItemListWrapper">
            <HotItem v-if="itemToggle" v-for="savingsItem in savingsHotItemList" :key="savingsItem.pname" v-bind="savingsItem" v-bind:toggle="itemToggle"></HotItem>
            <HotItem v-else v-for="fundItem in fundHotItemList" :key="fundItem.pname" v-bind="fundItem" v-bind:toggle="itemToggle"></HotItem>
        </div>
        <div id="HotItemToggle">
            <img id="left-arrow" src="@/assets/hotItem/arrow-left.png" width="36" height="36" @click="arrowClick">
            <div id="left-circle"></div>
            <div id="right-circle"></div>
            <img id="right-arrow" src="@/assets/hotItem/arrow-right.png" width="36" height="36" @click="arrowClick">
        </div>
    </div>
</template>
<script>
import HotItem from '@/components/hotItem/HotItem.vue';
import axios from 'axios';

export default {
    name : 'HotItemList',
    components : { HotItem },
    data(){
        return{
            savingsHotItemList : [],
            fundHotItemList : [],
            itemToggle : true
        }
    },
    created(){
        axios.get("http://localhost:9000/finance/savings/hot")
        .then((res)=>{
            this.savingsHotItemList = res.data;
        })
        .catch((err)=>{
            console.log(err);
        })

        axios.get("http://localhost:9000/finance/fund/hot")
        .then((res)=>{
            this.fundHotItemList = res.data;
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    methods : {
        arrowClick(){
            let $leftCircle = document.getElementById("left-circle");
            let $rightCircle = document.getElementById("right-circle");
            let $title = document.getElementById("title");
            let $hotItemList = document.getElementById("HotItemList");
            this.itemToggle = !this.itemToggle; //토글
            if(this.itemToggle){ //true면 예적금리스트로 전환
                $leftCircle.style.background = "black";
                $rightCircle.style.background = "none";
                $title.textContent = "예적금 Hot 상품";
                $hotItemList.style.background = "#CEF9FF";
            }else{ //false면 펀드핫리스트로 전환
                $leftCircle.style.background = "none";
                $rightCircle.style.background = "black";
                $title.textContent = "펀드 Hot 상품";
                $hotItemList.style.background = "#FFDDCE";
            }
        }
    }
}
</script>
<style scoped>
    #HotItemList{
        background-color: #CEF9FF;
        height: 600px;
        width: 1300px;
        border-radius: 20px;
        margin : auto;
        margin-top: 100px;
        padding-top: 30px;
    }
    #HotItemListWrapper{
        width: 1300px;
        display: flex;
        justify-content: space-evenly;
        margin-top: 30px;
    }
    #HotItemTitle{
        width: max-content;
        font-weight: bold;
        margin-left: 120px;
        font-size: 34px;
        display: flex;
        align-items: center;
    }
    #HotItemToggle{
        margin-top: 50px;
        width: 1300px;
        text-align: center;
        display : flex;
        align-items: center;
        justify-content: center;
    }
    #left-circle, #right-circle{
        display: inline-block;
        width: 34px;
        height: 34px;
        border: 5px solid black;
        border-radius: 100%;
        margin : 0px 10px 0px 10px;
    }
    #left-circle{
        margin-left: 10px;
        margin-right: 5px;
        background-color: black;
    }
    #right-circle{
        margin-right: 10px;
        margin-left: 5px
    }
    #left-arrow, #right-arrow{
        cursor: pointer;
    }
</style>