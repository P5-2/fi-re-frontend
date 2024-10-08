<template>
    <div id="HotItemList" @mouseover="clearMyInterval" @mouseout="startMyInterval">
        <div id="titleWrapper">
            <div id="HotItemTitle"><img src="@/assets/hotItem/fire.png" width="45" height="45"><span id="title">적금 Hot 상품</span></div>
            <span id="content1">목돈 만들기의 시작!</span> <br>
            <span id="content2">현재 가장 Hot한 적금 상품으로 목돈을 만들어보세요</span>
            <div id="HotItemToggle">
                <img id="left-arrow" src="@/assets/hotItem/arrow-left.png" width="36" height="36" @click="arrowLeftClick">
                <div id="left-circle"></div>
                <div id="center-circle"></div>
                <div id="right-circle"></div>
                <img id="right-arrow" src="@/assets/hotItem/arrow-right.png" width="36" height="36" @click="arrowRightClick">
            </div>
        </div>
        <table>
            <tbody>
                <tr v-if="currentType == 0"> <!--적금 리스트-->
                    <td v-for="financeItem in SHotItemList" :key="financeItem.fin_prdt_cd">
                        <HotItem v-bind:financeItem="financeItem" v-bind:financeType="itemType[0]"></HotItem>
                    </td>
                </tr>
                <tr v-else-if="currentType == 1"> <!--예금 리스트-->
                    <td v-for="financeItem in DHotItemList" :key="financeItem.fin_prdt_cd">
                        <HotItem v-bind:financeItem="financeItem" v-bind:financeType="itemType[1]"></HotItem>
                    </td>
                </tr>
                <tr v-else-if="currentType == 2"> <!-- 펀드 리스트-->
                    <td v-for="financeItem in fundHotItemList" :key="financeItem.pname">
                        <HotItem v-bind:financeItem="financeItem" v-bind:financeType="itemType[2]"></HotItem>
                    </td>
                </tr>
            </tbody>
        </table>
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
            SHotItemList : [], //적금 리스트
            DHotItemList : [], //예금 리스트
            fundHotItemList : [],
            itemType : ['적금', '예금', '펀드'],
            currentType : 0,
            myInterval : setInterval(()=>{
                this.arrowRightClick();
            }, 4000),
        }
    },
    created(){
        axios.get("http://localhost:9000/finance/hot", {params : {prdtDiv : 'S'}})
        .then((res)=>{
            this.SHotItemList = res.data;
            console.log(this.SHotItemList);
        })
        .catch((err)=>{
            console.log(err);
        })

        axios.get("http://localhost:9000/finance/hot", {params : {prdtDiv : 'D'}})
        .then((res)=>{
            this.DHotItemList = res.data;
            console.log(this.DHotItemList);
        })
        .catch((err)=>{
            console.log(err);
        })

        axios.get("http://localhost:9000/finance/fund/hot")
        .then((res)=>{
            this.fundHotItemList = res.data;
            console.log(this.fundHotItemList);
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    beforeUnmount(){
        clearInterval(this.myInterval);
    },
    methods : {
        arrowLeftClick(){
            this.currentType = (this.currentType == 0) ? 2 : this.currentType-1;
            this.toggleScreen();
        },
        arrowRightClick(){
            this.currentType = (this.currentType == 2) ? 0 : this.currentType+1;
            this.toggleScreen();
        },
        toggleScreen(){
            switch(this.currentType){
                case 0: //적금화면 구성
                    this.toggledLeft()
                    break;
                case 1: //예금화면 구성
                    this.toggledCenter()
                    break;
                case 2: //펀드화면 구성
                    this.toggledRight();
                    break;
            }
        },
        currentCircle : function($circle, color){
            $circle.style.background = color;
            $circle.style.width = "24px";
            $circle.style.height = "20px";
        },
        otherCircle : function($circle){
            $circle.style.background = "black";
            $circle.style.width = "18px";
            $circle.style.height = "14px";
        },
        makeContent : function(listColor, titleValue, content1Value, content2Value){
            let $hotItemList = document.getElementById("HotItemList");
            let $title = document.getElementById("title");
            let $content1 = document.getElementById("content1");
            let $content2 = document.getElementById("content2");

            $hotItemList.style.background = listColor;
            $title.textContent = titleValue;
            $content1.textContent = content1Value;
            $content2.textContent = content2Value;
        },
        toggledLeft : function(){//적금 상품
            let $leftCircle = document.getElementById("left-circle");
            let $rightCircle = document.getElementById("right-circle");
            let $centerCircle = document.getElementById("center-circle");

            this.otherCircle($rightCircle);
            this.otherCircle($centerCircle);
            this.currentCircle($leftCircle, "#3FAF4F")
            this.makeContent("#DBEFDB ", "적금 Hot 상품", "목돈 만들기의 시작!", "현재 가장 Hot한 적금 상품으로 목돈을 만들어보세요");
        },
        toggledCenter : function(){//예금 상품
            let $leftCircle = document.getElementById("left-circle");
            let $rightCircle = document.getElementById("right-circle");
            let $centerCircle = document.getElementById("center-circle");

            this.otherCircle($rightCircle);
            this.otherCircle($leftCircle);
            this.currentCircle($centerCircle, "#3F72AF")
            this.makeContent("#DBE2EF", "예금 Hot 상품", "부자가 되는 첫걸음!", "현재 가장 Hot한 예금 상품으로 목돈을 굴려보세요");
        },
        toggledRight : function(){//펀드 상품
            let $leftCircle = document.getElementById("left-circle");
            let $rightCircle = document.getElementById("right-circle");
            let $centerCircle = document.getElementById("center-circle");

            this.otherCircle($centerCircle);
            this.otherCircle($leftCircle);
            this.currentCircle($rightCircle, "#AF3F4F")
            this.makeContent("#EFDBDB", "펀드 Hot 상품", "다양한 자산 분산, 리스크 최소화!", "현재 가장 Hot한 펀드 상품으로 자산관리를 시작하세요");
        },
        clearMyInterval : function(){
            clearInterval(this.myInterval);
        },
        startMyInterval : function(){
            this.myInterval =  setInterval(()=>{
                this.arrowRightClick();
            }, 4000);
        }
    },
}
</script>
<style scoped>
    #HotItemList{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #DBEFDB  ;
        /* width: 1400px; */
        /* border-radius: 10px; */
        height: 500px;
        margin : auto;
        transition: all 1s;
    }
    #HotItemTitle{
        font-weight: bold;
        font-size: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom : 20px;

    }
    #titleWrapper{
        display : inline-block;
        width: 400px;
        margin-right: 30px;
    }
    #content1{
        display: inline-block;
        font-weight: bold;
        width: 400px;
        font-size: 24px;
    }
    #content2{
        display: inline-block;
        width: 350px;
        font-size: 18px;
    }
    #HotItemToggle{
        margin-top: 30px;
        text-align: center;
        display : flex;
        align-items: center;
        justify-content: center;
    }
    #left-circle, #right-circle, #center-circle{
        display: inline-block;
        width: 18px;
        height: 14px;
        border-radius: 5px;
        margin : 0px 10px 0px 10px;
        transition: all 0.2s;
        background-color: black;
    }
    #left-circle{
        width: 24px;
        height: 20px;
        margin-left: 10px;
        margin-right: 5px;
        background-color: #3FAF4F  ;
    }
    #right-circle{
        margin-right: 10px;
        margin-left: 5px;
    }
    #left-arrow, #right-arrow{
        cursor: pointer;
    }
    table{
        width: 780px;
    }
</style>