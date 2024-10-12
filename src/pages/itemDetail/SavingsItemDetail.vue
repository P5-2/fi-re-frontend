<template lang="">
    <div id="detailWrapper">
        <img class="back" src="@/assets/header/back.png" width="40" height="40" @click="back">
        <div id="title">
            {{savings.savingsDeposit.fin_prdt_nm}}
            <hr>
        </div>
        <div id="contentWrapper">
            <div class="myRow">
                <img :src="getIcon(savings.savingsDeposit.kor_co_nm)" alt="Deposit Icon" class="logo" width="60" height="60" />
                <span class="content1">
                    {{savings.savingsDeposit.kor_co_nm}} 
                    <sub class="myColor">
                        <b v-if="savings.savingsDeposit.prdt_div === 'S'">적금</b>
                        <b v-else>예금</b>
                    </sub>
                </span>
            </div>
            <table id="detailTable">
                <tbody>
                    <tr v-if="savings.options[0].rsrv_type !== null">
                        <th>적금유형</th>
                        <td v-if="savings.options[0].rsrv_type === 'S'">정기적금</td>
                        <td v-else>자유적금</td>
                    </tr>
                    <tr>
                        <th>가입대상</th>
                        <td>{{savings.savingsDeposit.join_member}}</td>
                    </tr>
                    <tr>
                        <th>최대한도</th>
                        <td v-if="savings.savingsDeposit.max_limit === null">없음</td>
                        <td v-else>{{savings.savingsDeposit.max_limit}}</td>
                    </tr>
                    <tr>
                        <th>금리유형</th>
                        <td>{{savings.options[0].intr_rate_type_nm}}</td>
                    </tr>
                    <tr>
                        <th>이율</th>
                        <td>
                            <tr v-for="option in savings.options">
                                <td><b>{{option.intr_rate}}% ~ {{option.intr_rate2}}% </b>({{option.save_trm}}개월)</td>
                            </tr>
                        </td>
                    </tr>
                    <tr>
                        <th>우대조건</th>
                        <td>{{savings.savingsDeposit.spcl_cnd}}</td>
                    </tr>
                    <tr>
                        <th>가입방법</th>
                        <td v-if="savings.savingsDeposit.join_way === null">-</td>
                        <td v-else>{{savings.savingsDeposit.join_way}}</td>
                    </tr>
                    <tr v-if="savings.savingsDeposit.etc_note !== null">
                        <th>기타유의사항</th>
                        <td>{{savings.savingsDeposit.etc_note}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="buttons">
            <button class="calc-btn fs-5 left-btn" @click="compareProduct">즐겨찾기</button>
            <button class="calc-btn fs-5" @click="calcBtn">수익계산</button>
        </div>
    </div>
    <OptionsCheckBox v-bind:options="savings.options" v-bind:isOptionsOpen="isOptionsOpen" @closeOptions="closeOptions" @submit="optionsControl"></OptionsCheckBox>
</template>
<script>
import { ref, onMounted } from 'vue';
import { calculatorStore } from '@/stores/calculator';
import axios from 'axios';
import { mapActions } from 'pinia';
import DefaultIcon from '@/assets/bank/defaultbank.png';
import OptionsCheckBox from './OptionsCheckBox.vue';
import { addSavingsToCart, addDepositToCart, checkSavingsInCart, checkDepositInCart } from '@/services/cartServiceSD.js'

export default {
    name: 'SavingsItemDetail',
    components: { OptionsCheckBox },
    data() {
        return {
            savings: {
                savingsDeposit: {},
                options: []
            },
            isOptionsOpen: false,
        }
    },
    created() {
        this.prdNo = this.$route.params.prdNo;
        this.intrRateTypeNm = this.$route.params.intrRateTypeNm;
        if (this.$route.params.rsrvType === 'null') {
            this.rsrvType = null
        } else {
            this.rsrvType = this.$route.params.rsrvType;
        }
        console.log(this.prdNo);
        axios.get("http://localhost:9000/finance/get", { params: { finPrdtCd: this.prdNo, intrRateTypeNm: this.intrRateTypeNm, rsrvType: this.rsrvType } })
            .then((res) => {
                this.savings.savingsDeposit = res.data[0].savingsDeposit;
                for (let data of res.data) {
                    this.savings.options.push(data.options[0]);
                }
                console.log(res.data);
                console.log(this.savings);
            })
            .catch((err) => {
                console.log(err);
            })
    },
    methods: {
        ...mapActions(calculatorStore, ['addSavings']),
        back: function () {
            this.$router.go(-1);
        },
        closeOptions: function () {
            this.isOptionsOpen = false;
        },
        optionsControl: function (value) {
            this.isOptionsOpen = false;
            let selectedSavings = {
                amount: 0,
                savingsDeposit: this.savings.savingsDeposit,
                options: [this.savings.options[value]]
            }
            this.addSavings(selectedSavings);
        },
        calcBtn: function () {
            this.isOptionsOpen = true;
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

        async compareProduct() {
            const username = this.getUsername();
            if (!username) {
                return alert("로그인이 필요한 기능입니다.");
            }

            const finPrdtCd = this.savings.savingsDeposit.fin_prdt_cd;
            const intrRateTypeNm = this.savings.options[0].intr_rate_type_nm;
            const isSavings = this.savings.savingsDeposit.prdt_div === 'S';

            try {
                // 적금 또는 예금 항목이 장바구니에 있는지 확인
                const isInCart = isSavings
                    ? await checkSavingsInCart(username, finPrdtCd, intrRateTypeNm)
                    : await checkDepositInCart(username, finPrdtCd, intrRateTypeNm);

                if (isInCart) {
                    alert("이 상품은 이미 비교함에 담겨 있습니다.");
                    return;
                }

                // 장바구니에 항목 추가
                if (isSavings) {
                    await addSavingsToCart(username, finPrdtCd, intrRateTypeNm);
                } else {
                    await addDepositToCart(username, finPrdtCd, intrRateTypeNm);
                }

                console.log(finPrdtCd + "번 상품을 비교함에 담았습니다.");
                alert("상품을 비교함에 담았습니다.");
            } catch (error) {
                console.error("장바구니 추가 중 오류 발생:", error);
                alert("상품을 비교함에 담는 중 오류가 발생했습니다.");
            }
        }

    },
    setup() {
        const iconMap = ref({});

        const getBankIcon = async (bankName) => {
            const formats = ['png', 'jpg']; // 지원하는 이미지 형식
            for (const format of formats) {
                try {
                    const icon = await import(`@/assets/bank/${bankName}.${format}`);
                    return icon.default;
                } catch (error) {
                    // Ignore the error and try the next format
                }
            }
            return DefaultIcon; // 모든 형식에서 아이콘이 없으면 기본 아이콘 반환
        };

        const loadIcons = async () => {
            const banks = [
                '국민은행', '우리은행', '신한은행', '하나은행', '한국스탠다드차타드은행',
                '아이엠뱅크', '부산은행', '광주은행', '제주은행', '전북은행',
                '경남은행', '중소기업은행', '한국산업은행', '농협은행주식회사',
                '주식회사 케이뱅크', '수협은행', '주식회사 카카오뱅크', '토스뱅크 주식회사'
            ];

            const promises = banks.map(async (bank) => {
                iconMap.value[bank] = await getBankIcon(bank);
            });

            await Promise.all(promises);
        };

        const getIcon = (bname) => {
            return iconMap.value[bname] || DefaultIcon; // 기본 아이콘
        };

        onMounted(() => {
            loadIcons();
        });

        return {
            iconMap,
            getIcon,
        };
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

#buttons {
    width: 80%;
    margin: auto;
    text-align: center;
}

.myRow {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.logo {
    border: 2px solid black;
    border-radius: 100%;
}

.content1 {
    background-color: none;
    margin-left: 26px;
    font-size: 28px;
}

#detailTable {
    width: 100%;
    font-size: 22px;
    border-collapse: separate;
    border-spacing: 20px 5px;
    background-color: white;
    border-radius: 20px;
    border: 1px solid black;
}

th {
    text-align: left;
    border-right: 2px solid black;
    width: 200px;
}

td {
    text-align: left;
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

.myColor {
    color: #3F72AF;
}

.back {
    float: left;
    cursor: pointer;
}
</style>