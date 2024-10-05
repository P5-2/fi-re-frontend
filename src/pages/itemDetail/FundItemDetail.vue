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
                        <th>기준가(원)</th>
                        <td>{{fund.nav}}</td>
                    </tr>
                    <tr>
                        <th>누적이율</th>
                        <td>
                            <b>{{fund.rate}}%</b><sub>3개월</sub>
                            / <b>{{fund.sixMRate}}%</b><sub>6개월</sub>
                            / <b>{{fund.oneYRate}}%</b><sub>1년</sub>
                        </td>
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
            <button class="fs-5 calc-btn left-btn" @click="compareProduct">즐겨찾기</button>
            <button class="fs-5 calc-btn" @click="calcBtn">수익계산</button>
        </div>
    </div>
</template>
<script>
import { calculatorStore } from '@/stores/calculator';
import axios from 'axios';
import { mapActions } from 'pinia';

export default {
    name: 'FundItemDetail',
    data() {
        return {
            fund: {}
        }
    },
    created: async function () {
        this.prdNo = this.$route.params.prdNo;
        let res = await axios.get("http://localhost:9000/finance/fund/get", { params: { prdNo: this.prdNo } })
        this.fund = res.data;
    },
    updated() {
        let $gradeIcon = document.getElementById("gradeIcon");
        let $gradeText = document.getElementById("gradeText");
        let $dngr = document.getElementById("dngr");

        switch (this.fund.dngrGrade) {
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
    methods: {
        ...mapActions(calculatorStore, ['addFund']),
        calcBtn: function () {
            this.fund.amount = 0;
            this.addFund(this.fund);
            alert("상품을 계산기에 추가했습니다");
        },
        compareProduct() {
            // sessionStorage에서 token 값을 가져와 파싱
            const tokenData = JSON.parse(sessionStorage.getItem('token'));
            if(tokenData === null){
                return alert("로그인이 필요한 기능입니다");
            }
            // accessToken을 가져온다
            const accessToken = tokenData.accessToken;

            // accessToken을 기반으로 사용자별 로컬 스토리지 키 생성
            const userKey = `cart_data_${accessToken}`;

            // 로컬 스토리지에서 비교함 데이터를 불러온다
            const cartData = JSON.parse(localStorage.getItem(userKey)) || { savings: [], funds: [] };

            // 추가하려는 상품이 이미 비교함에 있는지 확인
            const isProductInCart = cartData.funds.some(fund => fund.prdNo === this.fund.prdNo);

            if (isProductInCart) {
                alert("이 상품은 이미 비교함에 담겨 있습니다.");
                return;
            }

            // 비교함에 상품 추가
            cartData.funds.push({
                prdNo: this.fund.prdNo,
                pname: this.fund.pname,
                type: this.fund.type,
                nav: this.fund.nav,
                rate: this.fund.rate,
                region: this.fund.region,
                selectCount: this.fund.selectCount,
                dngrGrade: this.fund.dngrGrade
            });

            // 업데이트된 비교함 데이터를 로컬 스토리지에 저장
            localStorage.setItem(userKey, JSON.stringify(cartData));

            console.log(this.fund.prdNo + "번 상품을 비교함에 담았습니다.");
            alert("상품을 비교함에 담았습니다.");
        }
    }
}
</script>
<style scoped>
#detailWrapper {
    border: 1px solid #ddd;
    border-radius: 20px;
    width: 1200px;
    margin: auto;
    padding: 30px 30px 60px 30px;
}

#title {
    width: 80%;
    margin: auto;
    text-align: center;
    font-size: 42px;
    font-weight: bold;
}

#contentWrapper {
    width: 80%;
    padding: 30px;
    margin: auto;
}

.myRow {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

#gradeIcon {
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

#iconWrapper {
    width: 120px;
    margin-right: 20px;
}

#gradeText {
    width: max-content;
    margin: auto;
    font-weight: bold;
}

#gradeDesc {
    font-size: 30px;
}

#dngr {
    font-weight: bold;
}

#detailTable {
    width: 100%;
    font-size: 22px;
    border-collapse: separate;
    border-spacing: 20px 5px;
    background-color: #F9F7F7;
    border-radius: 20px;
    border : 1px solid black;
}

th {
    text-align: left;
    border-right: 2px solid black;
    width: 200px;
}

td{
    text-align: left;
}

#buttons {
    width: 80%;
    margin: auto;
    margin-top: 10px;
    text-align: center;
}

.calc-btn {
    background-color: #3F72AF;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: 0.3s;
}
.calc-btn:hover {
    background-color: #112D4E;
}
.left-btn {
    margin-right: 60px;
    background-color: #A9A9A9;
}
.left-btn:hover{
    background-color: #696969;
}
</style>