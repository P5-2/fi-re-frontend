<template lang="">
    <div id="detailWrapper">
        <img class="back" src="@/assets/header/back.png" width="40" height="40" @click="back">
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
import { addFundToCart, checkFundInCart } from '@/services/cartServiceFund.js'

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
        back: function () {
            this.$router.go(-1);
        },
        calcBtn: function () {
            this.fund.amount = 0;
            this.addFund(this.fund)
        },
        getUsername() {
            // 로컬 스토리지에서 user 데이터를 가져옴
            const userData = JSON.parse(localStorage.getItem("user"));

            // user 데이터가 존재하고, username이 있을 경우 반환
            if (userData && userData.username) {
                return userData.username;
            } else {
                console.error("Username not found in localStorage");
                return null;
            }
        },

        // 좋아요 상태 로드
        async loadLikeStatus() {
            try {
                const username = this.getUsername();

                // 서버에서 현재 사용자가 이 펀드를 장바구니에 담았는지 확인
                const isInCart = await checkFundInCart(
                    username,
                    this.fund.prdNo
                );
                this.fund.userLiked = isInCart;
            } catch (error) {
                console.error("좋아요 상태 로드 에러났습니다: \n", error);
            }
        },


        async compareProduct() {
            const username = this.getUsername();
            if (!username) {
                return alert("로그인이 필요한 기능입니다.");
            }

            // 추가하려는 상품이 이미 비교함에 있는지 확인 (await 추가)
            const isProductInCart = await this.loadLikeStatus();

            if (isProductInCart) {
                console.log(isProductInCart);
                alert("이 상품은 이미 비교함에 담겨 있습니다.");
                return;
            }

            // 서버에 즐겨찾기 추가 요청
            try {
                await addFundToCart(username, this.fund.prdNo);
                console.log(this.fund.prdNo + "번 상품을 비교함에 담았습니다.");
                alert("상품을 비교함에 담았습니다.");
            } catch (error) {
                console.error("장바구니 추가 중 오류 발생:", error);
                alert("상품을 비교함에 담는 중 오류가 발생했습니다.");
            }
        }

    }
}
</script>
<style scoped>
#detailWrapper {
    width: 1200px;
    margin: auto;
    padding: 30px 30px 60px 30px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
    border: 1px solid black;
    border-radius: 20px;
    background-color: white;
}

th {
    text-align: left;
    border-right: 2px solid black;
    width: 200px;
}

td {
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

.left-btn:hover {
    background-color: #696969;
}

.back {
    float: left;
    cursor: pointer;
}
</style>