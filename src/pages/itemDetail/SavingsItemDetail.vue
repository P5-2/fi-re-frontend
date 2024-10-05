<template lang="">
    <div id="detailWrapper">
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
                        <td><b>최저 {{savings.options[0].intr_rate}}% ~ 최고 {{savings.options[0].intr_rate2}}%</b></td>
                    </tr>
                    <tr>
                        <th>기간</th>
                        <td>{{savings.options[0].save_trm}}개월</td>
                    </tr>
                    <tr>
                        <th>우대조건</th>
                        <td>{{savings.savingsDeposit.spcl_cnd}}</td>
                    </tr>
                    <tr>
                        <th>가입방법</th>
                        <td>{{savings.savingsDeposit.join_way}}</td>
                    </tr>
                    <tr v-if="savings.savingsDeposit.etc_note !== null">
                        <th>기타유의사항</th>
                        <td>{{savings.savingsDeposit.etc_note}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="buttons">
            <button class="calc-btn fs-5 left-btn" @click="compareProduct">상품비교</button>
            <button class="calc-btn fs-5" @click="calcBtn">수익계산</button>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { calculatorStore } from '@/stores/calculator';
import axios from 'axios';
import { mapActions } from 'pinia';
import DefaultIcon from '@/assets/bank/defaultbank.png';

export default {
    name: 'SavingsItemDetail',
    data() {
        return {
            savings: {},
        }
    },
    created() {
        this.prdNo = this.$route.params.prdNo;
        this.saveTrm = this.$route.params.saveTrm;
        console.log(this.prdNo);
        axios.get("http://localhost:9000/finance/get", { params: { finPrdtCd: this.prdNo, saveTrm: this.saveTrm } })
            .then((res) => {
                this.savings = res.data;
                console.log(this.savings);
            })
            .catch((err) => {
                console.log(err);
            })
    },
    methods: {
        ...mapActions(calculatorStore, ['addSavings']),
        calcBtn: function () {
            this.savings.amount = 0;
            this.addSavings(this.savings);
            alert("상품을 계산기에 추가했습니다");
        },
        compareProduct() {

            // sessionStorage에서 token 값을 가져와 파싱
            const tokenData = JSON.parse(sessionStorage.getItem('token'));

            // accessToken을 가져온다
            const accessToken = tokenData.accessToken;

            // accessToken을 기반으로 사용자별 로컬 스토리지 키 생성
            const userKey = `cart_data_${accessToken}`;

            // 로컬 스토리지에서 비교함 데이터를 불러온다
            const cartData = JSON.parse(localStorage.getItem(userKey)) || { savings: [], funds: [] };

            // 추가하려는 상품이 이미 비교함에 있는지 확인
            const isProductInCart = cartData.savings.some(saving => saving.prdNo === this.prdNo);

            if (isProductInCart) {
                alert("이 상품은 이미 비교함에 담겨 있습니다.");
                return;
            }

            // 비교함에 상품 추가
            cartData.savings.push({
                prdNo: this.savings.prdNo,
                pname: this.savings.pname,
                bname: this.savings.bname,
                minRate: this.savings.minRate,
                maxRate: this.savings.maxRate,
                subPeriod: this.savings.subPeriod,
                description: this.savings.description,
                type: this.savings.type,
                selectCount: this.savings.selectCount || 0,  // selectCount이 존재하지 않을 경우 기본값 0 설정
            });

            // 업데이트된 비교함 데이터를 로컬 스토리지에 저장
            localStorage.setItem(userKey, JSON.stringify(cartData));

            console.log(this.prdNo + "번 상품을 비교함에 담았습니다.");
            alert("상품을 비교함에 담았습니다.");
        },
    },
    setup(){
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
    border : 2px solid black;
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
.myColor{
    color: #3F72AF;
}
</style>