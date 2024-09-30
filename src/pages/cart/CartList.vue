<template>
    <div id="CartList">
        <div class="header">
            <h2>비교함</h2>
            <p>{{ savings.length + funds.length }} 건의 상품이 비교함에 담겨있습니다.</p>
            
            <!-- 삭제 버튼 추가 -->
            <button @click="removeSelectedItems" class="remove-btn">선택한 항목 삭제</button>
        </div>

        <div v-if="savings.length || funds.length">
            <h3>저축 상품</h3>
            <ul v-if="savings.length">
                <CartItem
                    v-for="(saving, index) in savings"
                    :key="index"
                    :item="saving"
                    type="saving"
                    :isSelected="selectedSavings.has(saving.prdNo)"
                    @update-selected-items="updateSelectedSavings"
                />
            </ul>
            <p v-else>장바구니에 저축 상품이 없습니다.</p>

            <h3>펀드 상품</h3>
            <ul v-if="funds.length">
                <CartItem
                    v-for="(fund, index) in funds"
                    :key="index"
                    :item="fund"
                    type="fund"
                    :isSelected="selectedFunds.has(fund.prdNo)"
                    @update-selected-items="updateSelectedFunds"
                />
            </ul>
            <p v-else>장바구니에 펀드 상품이 없습니다.</p>

        </div>
        <div v-else>
            <p>장바구니에 상품이 없습니다.</p>
        </div>
    </div>
</template>

<script>
import CartItem from '@/components/cart/CartItem.vue';

export default {
    name: 'CartList',
    components: {
        CartItem
    },
    data() {
        return {
            savings: [],
            funds: [],
            selectedSavings: new Set(), // 선택된 저축 상품을 Set으로 관리
            selectedFunds: new Set(), // 선택된 펀드 상품을 Set으로 관리
            userKey: '' // 사용자별 비교함 데이터를 저장할 키
        };
    },
    created() {
        this.setUserKey(); // 사용자 키를 설정
        this.loadCartItems(); // 비교함 데이터를 불러온다
    },
    methods: {
        setUserKey() {
            const tokenData = JSON.parse(sessionStorage.getItem('token'));
            if (tokenData && tokenData.accessToken) {
                this.userKey = `cart_data_${tokenData.accessToken}`; // accessToken을 기반으로 사용자별 키 생성
            } else {
                console.error('No access token found in session storage.');
            }
        },
        loadCartItems() {
            const cartData = JSON.parse(localStorage.getItem(this.userKey)) || { savings: [], funds: [] };
            this.savings = cartData.savings;
            this.funds = cartData.funds;
        },
        saveCartItems() {
            const cartData = {
                savings: this.savings,
                funds: this.funds
            };
            localStorage.setItem(this.userKey, JSON.stringify(cartData));
        },
        updateSelectedSavings({ prdNo, isSelected }) {
            if (isSelected) {
                this.selectedSavings.add(prdNo);
            } else {
                this.selectedSavings.delete(prdNo);
            }
        },
        updateSelectedFunds({ prdNo, isSelected }) {
            if (isSelected) {
                this.selectedFunds.add(prdNo);
            } else {
                this.selectedFunds.delete(prdNo);
            }
        },
        removeSelectedItems() {
            this.savings = this.savings.filter(saving => !this.selectedSavings.has(saving.prdNo));
            this.funds = this.funds.filter(fund => !this.selectedFunds.has(fund.prdNo));

            this.selectedSavings.clear();
            this.selectedFunds.clear();

            this.saveCartItems(); // 변경된 비교함 데이터를 저장한다
        }
    }
}
</script>

<style scoped>
#CartList {
    padding: 20px;
    width: 70%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 10px;
    margin-bottom: 20px;
}

.header {
    text-align: center;
    margin-bottom: 20px;
}

h2 {
    margin-bottom: 10px;
    font-size: 1.5em;
    font-weight: bold;
}

h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 1.2em;
    color: #333;
    font-weight: bold;
}

ul {
    list-style-type: none;
    padding-left: 0;
}

p {
    font-size: 14px;
    color: #555;
    text-align: center;
}

.remove-btn {
    background-color: #ff4d4d;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: bold;
    border: none;
}

.remove-btn:hover {
    background-color: #ff0000;
}
</style>
