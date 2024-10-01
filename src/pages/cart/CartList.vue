<template>
    <div id="CartList">
        <div class="header">
            <h2>즐겨찾기</h2>
            <p>{{ currentItems.length }} 건의 상품이 즐겨찾기에 담겨있습니다.</p>
            <div class="tab-buttons">
                <button @click="selectedTab = 'deposit'" :class="{ active: selectedTab === 'deposit' }">예금</button>
                <button @click="selectedTab = 'saving'" :class="{ active: selectedTab === 'saving' }">적금</button>
                <button @click="selectedTab = 'fund'" :class="{ active: selectedTab === 'fund' }">펀드</button>
            </div>
            <button @click="removeSelectedItems" class="remove-btn">선택한 항목 삭제</button>
        </div>

        <div v-if="currentItems.length">
            <h3>{{ tabTitle }}</h3>
            <ul>
                <CartItem
                    v-for="(item, index) in currentItems"
                    :key="index"
                    :item="item"
                    :type="selectedTab"
                    :isSelected="selectedItems.has(item.prdNo)"
                    @update-selected-items="updateSelectedItems"
                />
            </ul>
        </div>
        <div v-else>
            <p>장바구니에 상품이 없습니다.</p>
        </div>
    </div>
</template>
<script>
import CartItem from '@/components/cart/CartItem.vue';
import { loadFunds } from '@/services/cartService.js'
export default {
    name: 'CartList',
    components: {
        CartItem
    },
    data() {
        return {
            funds: [],
            selectedItems: new Set(),
            selectedTab: 'fund',
        };
    },
    computed: {
        currentItems() {
            if (this.selectedTab === 'deposit') {
                return []; // 예금 데이터가 없으므로 빈 배열 반환
            } else if (this.selectedTab === 'saving') {
                return []; // 적금 데이터가 없으므로 빈 배열 반환
            } else if (this.selectedTab === 'fund') {
                return this.funds;
            }
        },
        tabTitle() {
            if (this.selectedTab === 'deposit') {
                return '예금 상품';
            } else if (this.selectedTab === 'saving') {
                return '적금 상품';
            } else if (this.selectedTab === 'fund') {
                return '펀드 상품';
            }
        }
    },
    created() {
        this.setUserKey();
        this.loadFunds();
    },
    methods: {
        setUserKey() {
            const tokenData = JSON.parse(sessionStorage.getItem('token'));
            if (tokenData && tokenData.accessToken) {
                this.userKey = `cart_data_${tokenData.accessToken}`;
            } else {
                alert("로그인 해주세요.");
            }
        },
        async loadFunds() {
            this.funds = await loadFunds();
        },
        updateSelectedItems({ prdNo, isSelected }) {
            if (isSelected) {
                this.selectedItems.add(prdNo);
            } else {
                this.selectedItems.delete(prdNo);
            }
        },
        removeSelectedItems() {
            if (this.selectedTab === 'deposit') {
                // 예금 데이터가 없으므로 처리하지 않음
            } else if (this.selectedTab === 'saving') {
                // 적금 데이터가 없으므로 처리하지 않음
            } else if (this.selectedTab === 'fund') {
                let likedFunds = JSON.parse(localStorage.getItem('likedFunds')) || [];

                this.funds = this.funds.filter(fund => {
                    const isSelected = this.selectedItems.has(fund.prdNo);
                    if (isSelected) {
                        likedFunds = likedFunds.filter(id => id !== fund.prdNo);
                    }
                    return !isSelected;
                });

                localStorage.setItem('likedFunds', JSON.stringify(likedFunds));
            }

            // 선택된 항목 초기화
            this.selectedItems.clear();
        }
    }
}
</script>

<style scoped>
#CartList {
    padding: 20px;
    width: 70%;
    margin: 0 auto;
    border-radius: 10px;
    margin-bottom: 20px;
}

.header {
    text-align: center;
    margin-bottom: 20px;
}

h2 {
    margin-bottom: 10px;
    font-size: 1.8em;
    font-weight: bold;
    color: #112D4E; /* 팀 컬러 적용 */
}

h3 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 1.5em;
    color: #000000; 
    font-weight: bold;
    text-align: center;
}

ul {
    list-style-type: none;
    padding-left: 0;
}

p {
    font-size: 16px;
    color: #112D4E; /* 팀 컬러 적용 */
    text-align: center;
}

.remove-btn {
    background-color: #3F72AF; /* 팀 컬러 적용 */
    color: white;
    padding: 10px 20px;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: bold;
    border: none;
    margin-top: 10px;
}

.remove-btn:hover {
    background-color: #112D4E; /* 팀 컬러 적용 */
}

.tab-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.tab-buttons button {
    background-color: #DBE2EF; /* 팀 컬러 적용 */
    border: 2px solid #3F72AF; /* 팀 컬러 적용 */
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    color: #3F72AF; /* 팀 컬러 적용 */
    border-radius: 30px;
}

.tab-buttons button.active {
    background-color: #3F72AF; /* 팀 컬러 적용 */
    color: white;
}

.tab-buttons button:hover {
    background-color: #112D4E; /* 팀 컬러 적용 */
    color: white;
    border-color: #112D4E; /* 팀 컬러 적용 */
}
</style>
