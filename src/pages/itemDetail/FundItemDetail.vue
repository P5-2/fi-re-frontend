<template lang="">
    <div id="detailWrapper">
        <div id="title">
            {{fund.pname}}
            <hr>
        </div>
        <div id="contentWrapper">
            <div class="myRow">
                <div id="iconWrapper">
                    <div id="gradeIcon"></div>
                    <div id="gradeText"></div>
                </div>
                <div id="gradeDesc">위상품은 <span id="dngr">안전형</span> 상품입니다</div>
            </div>
            <table id="detailTable">
                <tbody>
                    <tr>
                        <th>투자형태</th>
                        <td>{{fund.type}}</td>
                    </tr>
                    <tr>
                        <th>3개월누적이율</th>
                        <td><b>{{fund.rate}}%</b></td>
                    </tr>
                    <tr>
                        <th>투자지역</th>
                        <td>{{fund.region}}</td>
                    </tr>
                    <tr>
                        <th>등록일</th>
                        <td>{{fund.bseDt}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="buttons">
            <button class="btn btn-secondary fs-5 left-btn">상품비교</button>
            <button class="btn btn-success fs-5">수익계산</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    name : 'FundItemDetail',
    data(){
        return{
            fund : {}
        }
    },
    created : async function(){
        this.prdNo = this.$route.params.prdNo;
        let res = await axios.get("http://localhost:9000/finance/fund/get", {params : {prdNo : this.prdNo}})
        this.fund = res.data;
    },
    updated(){
        let $gradeIcon = document.getElementById("gradeIcon");
        let $gradeText = document.getElementById("gradeText");
        let $dngr = document.getElementById("dngr");

        switch(this.fund.dngrGrade){
            case 6:
                $gradeIcon.textContent = '6';
                $gradeIcon.style.backgroundColor = '#146138';
                $gradeText.textContent = '매우낮은위험';
                $gradeText.style.color = '#146138';
                $dngr.style.color = '#146138';
                $dngr.textContent = '안전형';
                break;
            case 5:
                $gradeIcon.textContent = '5';
                $gradeIcon.style.backgroundColor = '#1D9A58';
                $gradeText.textContent = '낮은위험';
                $gradeText.style.color = '#1D9A58';
                $dngr.style.color = '#1D9A58';
                $dngr.textContent = '안전추구형';
                break;
            case 4:
                $gradeIcon.textContent = '4';
                $gradeIcon.style.backgroundColor = '#FBBF0A';
                $gradeText.textContent = '보통위험';
                $gradeText.style.color = '#FBBF0A';
                $dngr.style.color = '#FBBF0A';
                $dngr.textContent = '위험중립형';
                break;
            case 3:
                gradeIcon.textContent = '3';
                $gradeIcon.style.backgroundColor = '#F79E07';
                $gradeText.textContent = '다소높은위험';
                $gradeText.style.color = '#F79E07';
                $dngr.style.color = '#EB5908';
                $dngr.textContent = '성장추구형';
                break;
            case 2:
            $gradeIcon.textContent = '2';
                $gradeIcon.style.backgroundColor = '#EB5908';
                $gradeText.textContent = '높은위험';
                $gradeText.style.color = '#EB5908';
                $dngr.style.color = '#EB5908';
                $dngr.textContent = '성장추구형';
                break;
            case 1:
            $gradeIcon.textContent = '1';
                $gradeIcon.style.backgroundColor = '#DD1820';
                $gradeText.textContent = '매우높은위험';
                $gradeText.style.color = '#DD1820';
                $dngr.style.color = '#DD1820';
                $dngr.textContent = '성장형';
                break;
        }
    },
}
</script>
<style scoped>
    #detailWrapper{
        background-color: #FFE9E0;
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
    .myRow{
        display: flex;
        align-items: center;
        margin-bottom: 30px;
    }
    #gradeIcon{
        width: 60px;
        height: 60px;
        border-radius: 100%;
        font-weight: 600;
        background-color: #146138;
        color: white;
        text-align: center;
        line-height: 60px;
        font-size: 32px;
        margin: auto;
    }
    #iconWrapper{
        width: 120px;
        margin-right: 20px;
    }
    #gradeText{
        width: max-content;
        margin: auto;
        font-weight: bold;
    }
    #gradeDesc{
        font-size: 30px;
    }
    #dngr{
        font-weight: bold;
    }
    #detailTable{
        width: 100%;
        font-size: 22px;
        border-collapse: separate;
        border-spacing: 10px 10px;
        background-color: #FFF4F0;
        border-radius: 20px;
    }
    th{
        border-right: 2px solid black;
        width: 200px;
    }
    #buttons{
        width: 80%;
        margin: auto;
        margin-top: 10px;
        text-align: center;
    }
    .left-btn{
        margin-right: 60px;
    }
</style>