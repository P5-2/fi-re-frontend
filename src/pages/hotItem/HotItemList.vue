<template>
    <div id="HotItemList" @mouseover="clearMyInterval" @mouseout="startMyInterval">
        <div id="titleWrapper">
            <div id="HotItemTitle"><img src="@/assets/hotItem/fire.png" width="45" height="45"><span id="title">예적금 Hot 상품</span></div>
            <span id="content1">목돈 만들기의 시작!</span> <br>
            <span id="content2">현재 가장 Hot한 예적금 상품으로 목돈을   만들어보세요</span>
            <div id="HotItemToggle">
                <img id="left-arrow" src="@/assets/hotItem/arrow-left.png" width="36" height="36" @click="arrowClick">
                <div id="left-circle"></div>
                <div id="right-circle"></div>
                <img id="right-arrow" src="@/assets/hotItem/arrow-right.png" width="36" height="36" @click="arrowClick">
            </div>
        </div>
        <table>
            <tbody>
                <tr v-if="itemToggle">
                    <td v-for="savingsItem in savingsHotItemList" :key="savingsItem.pname">
                        <HotItem v-bind="savingsItem" v-bind:toggle="itemToggle"></HotItem>
                    </td>
                </tr>
                <tr v-else>
                    <td v-for="fundItem in fundHotItemList" :key="fundItem.pname">
                        <HotItem v-bind="fundItem" v-bind:toggle="itemToggle"></HotItem>
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
            savingsHotItemList : [],
            fundHotItemList : [],
            itemToggle : true,
            myInterval : setInterval(()=>{
                this.itemToggle = !this.itemToggle
                if(this.itemToggle){ //true면 예적금리스트로 전환
                    this.toggledTrue();
                }else{ //false면 펀드핫리스트로 전환
                    this.toggledFalse();
                }
            }, 4000),
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
            this.itemToggle = !this.itemToggle; //토글
            if(this.itemToggle){ //true면 예적금리스트로 전환
                this.toggledTrue();
            }else{ //false면 펀드핫리스트로 전환
                this.toggledFalse();
            }
        },
        toggledTrue : function(){
            let $leftCircle = document.getElementById("left-circle");
            let $rightCircle = document.getElementById("right-circle");
            let $title = document.getElementById("title");
            let $hotItemList = document.getElementById("HotItemList");
            let $content1 = document.getElementById("content1");
            let $content2 = document.getElementById("content2");

            $rightCircle.style.background = "black";
            $rightCircle.style.width = "18px";
            $rightCircle.style.height = "14px";
            $leftCircle.style.background = "#778DFF";
            $leftCircle.style.width = "24px";
            $leftCircle.style.height = "20px";
            $title.textContent = "예적금 Hot 상품";
            $hotItemList.style.background = "#E0E7FF";
            $content1.textContent = "목돈 만들기의 시작!"
            $content2.textContent = "현재 가장 Hot한 예적금 상품으로 목돈을 만들어보세요"
        },
        toggledFalse : function(){
            let $leftCircle = document.getElementById("left-circle");
            let $rightCircle = document.getElementById("right-circle");
            let $title = document.getElementById("title");
            let $hotItemList = document.getElementById("HotItemList");
            let $content1 = document.getElementById("content1");
            let $content2 = document.getElementById("content2");

            $rightCircle.style.background = "#FA5454";
            $rightCircle.style.width = "24px";
            $rightCircle.style.height = "20px";
            $leftCircle.style.background = "black";
            $leftCircle.style.width = "18px";
            $leftCircle.style.height = "14px";
            $title.textContent = "펀드 Hot 상품";
            $hotItemList.style.background = "#F8D7DA";
            $content1.textContent = "다양한 자산 분산, 리스크 최소화!"
            $content2.textContent = "현재 가장 Hot한 펀드 상품으로 자산관리를 시작하세요"
        },
        clearMyInterval : function(){
            clearInterval(this.myInterval);
        },
        startMyInterval : function(){
            this.myInterval =  setInterval(()=>{
                this.itemToggle = !this.itemToggle
                    if(this.itemToggle){ //true면 예적금리스트로 전환
                        this.toggledTrue();
                    }else{ //false면 펀드핫리스트로 전환
                        this.toggledFalse();
                    }
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
        background-color: #E0E7FF;
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
    #left-circle, #right-circle{
        display: inline-block;
        width: 18px;
        height: 14px;
        border-radius: 5px;
        margin : 0px 10px 0px 10px;
        transition: all 0.2s;
    }
    #left-circle{
        width: 24px;
        height: 20px;
        margin-left: 10px;
        margin-right: 5px;
        background-color: #778DFF;
    }
    #right-circle{
        margin-right: 10px;
        margin-left: 5px;
        background-color: black;
    }
    #left-arrow, #right-arrow{
        cursor: pointer;
    }
    table{
        width: 780px;
    }
</style>