<template lang="">
    <div id="tipWrapper">
        <TipDetail v-bind:tips="financeTips" v-bind:category="finance" />
        <TipDetail v-bind:tips="bankTips" v-bind:category="bank" />
    </div>
</template>
<script>
import TipDetail from './TipDetail.vue';
import axios from 'axios';

export default {
    name : 'Tip',
    data(){
        return{
            tips : {
                name : '착오송금 예방 및 대응요령',
                path : '/src/assets/tip/bankTip/tip01',
                count : 8
            },
            financeTips : [],
            bankTips : [],
            finance : "금융상품",
            bank : "은행"
        }
    },
    components : {TipDetail},
    created(){
        axios.get("http://localhost:9000/tip/findAll")
        .then((res)=>{
            let tips = res.data;
            this.financeTips = tips.filter((tip)=>{
                return tip.type === "금융상품";
            });
            this.bankTips = tips.filter((tip)=>{
                return tip.type === "은행";
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    mounted(){
        // let $tipContent = document.getElementById("tipContent");
        // console.log(this.tips.count);

        // for(let i=1; i<=this.tips.count; i++){
        //     let $img = document.createElement("img");
        //     $img.src = `${this.tips.path}/img${i}.jpeg`;
        //     $img.width = "500"
        //     $img.height = "500"
        //     console.log($img);
        //     $tipContent.appendChild($img);
        // }
    }
}
</script>
<style lang="">
    
</style>