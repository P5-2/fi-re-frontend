<template>
    <div id="TipDetail">
        <div id="title">
            {{ category }} 꿀팁
        </div>
        <div>
            <ul id="tipNmWrapper">
                <li class="arrow" @click="leftArrow"><</li>
                <li class="tipNm" v-for="(tip, index) in myTips" @click="tipOpen(tip, index)">
                    <div class="nm">
                        <img v-if="category === '금융상품'" src="@/assets/tip/finance.png" width="60" height="60">
                        <img v-else src="@/assets/tip/bank.png" width="60" height="60">
                        {{ tip.name }}
                    </div>
                </li>
                <li class="arrow" @click="rightArrow">></li>
            </ul>
        </div>
        <div class="content" @click="tipClose">

        </div>
    </div>
</template>
<script>
export default {
    name : 'TipDetail',
    props : ['tips', 'category'],
    data(){
        return {
            myTips : [],
            myLoc : 0
        }
    },
    beforeUpdate(){
        this.myTips = this.tips.slice(this.myLoc, this.myLoc+3);
    },
    methods : {
        leftArrow : function(){
            this.tipClose();
            this.myLoc -= 3;
            if(this.myLoc < 0){
                this.myLoc = 0;
            }
            this.myTips = this.tips.slice(this.myLoc, this.myLoc+3);
        },
        rightArrow : function(){
            this.tipClose();
            this.myLoc += 3;
            if(this.myLoc >= this.tips.length){
                this.myLoc -= 3;
            }
            this.myTips = this.tips.slice(this.myLoc, this.myLoc+3);
        },
        getContentTag : function(){
            let $content;
            if(this.category === "금융상품"){
                $content = document.getElementsByClassName("content")[0];
            }else{
                $content = document.getElementsByClassName("content")[1];
            }
            return $content;
        },
        tipOpen : function(tip, index){
            if(this.category === "은행"){
                index += 3;
            }
            console.log(index);
            this.tipClose();
            let $content = this.getContentTag();
            $content.style.display = "flex";
            $content.innerHTML = "";
            $content.style.backgroundColor = "#F9F7F7";
            
            let $tipNm = document.getElementsByClassName("tipNm")[index];
            $tipNm.style.backgroundColor = "#F9F7F7";
            $tipNm.style.borderTop = "3px solid #3F72AF";

            for(let i=1; i<=tip.count; i++){
                let $img = document.createElement("img");
                $img.src = `${tip.path}/img${i}.jpeg`;
                $img.width = "600";
                $img.height = "600";
                $content.appendChild($img);
            }
        },
        tipClose : function(){
            let $content = this.getContentTag();
            $content.style.display = "none";
            $content.innerHTML = "";

            let $tipNms = document.getElementsByClassName("tipNm");
            let i;
            let j;
            if(this.category === "금융상품"){
                i=0;
                j=3;
            }else{
                i=3;
                j=6;
            }
            for(i; i<j; i++){
                $tipNms[i].style.backgroundColor = "#FFFFFF";
                $tipNms[i].style.borderTop = "none";
            }
        }
    }
}
</script>
<style scoped>
    #TipDetail{
        margin-top: 60px;
    }
    #title{
        width : 1200px;
        margin : auto;
        font-weight: bold;
        font-size: 28px;
        margin-bottom: 20px;
    }
    ul, li{
        list-style: none;
        margin: 0;
        padding: 0;
    }
    ul{
        display: flex;
        flex-wrap: wrap;
        justify-content:space-between;
        align-items: center;
        width : 1200px;
        margin: auto;
    }
    .arrow{
        font-size: 70px;
        width: 70px;
        height: 70px;
        line-height: 55px;
        cursor: pointer;
    }
    .arrow:hover{
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    .tipNm{
        width: 345px;
        padding : 20px;
    }
    .nm{
        cursor: pointer;
        font-size: 20px;
        width: 300px;
        height: 140px;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .nm:hover{
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    .content{
        cursor: pointer;
        display: none;
        align-items: center;
        flex-direction: column;
        margin: auto;
        padding: 30px;
        width: 1200px;
    }
    .content:hover{
        background-color: #ededed;
    }
    img {
        margin-right: 10px;
    }
</style>